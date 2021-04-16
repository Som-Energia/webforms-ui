import React, { useState, useEffect } from 'react'

import ReactGA from 'react-ga'

import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'

import DisplayFormikState from '../components/DisplayFormikState'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

import MemberIdentifier from './Contract/MemberIdentifier'
import CUPS from './Contract/CUPS'
import SupplyPoint from './Contract/SupplyPoint'
import PowerFare from './Contract/PowerFare'
import SelfConsumption from './Contract/SelfConsumption'
import SelfConsumptionDetails from './Contract/SelfConsumptionDetails'
import HolderIdentifier from './Contract/HolderIdentifier'
import PersonalData from './HolderChange/PersonalData'
import VoluntaryCent from './HolderChange/VoluntaryCent'
import IBAN from './HolderChange/IBAN'
import Review from './Contract/Review'

import Success from './Success'
import Failure from './Failure'

import { getRates, contract } from '../services/api'
import { CNAE_HOUSING, normalizeContract } from '../services/utils'
const GA_TRACKING_ID = window?.config?.GA_TRAKING_ID

const keyMap = {
  SAMPLE_DATA: 'ctrl+shift+1',
  SHOW_INSPECTOR: 'ctrl+shift+d'
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    color: theme.palette.text.primary
  },
  stepContainer: {
    marginTop: 0,
    marginBottom: theme.spacing(4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.backgroundColor
  },
  step: {
    position: 'absolute',
    width: '100%'
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const Contract = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})

  const [rates] = useState(getRates())

  const handlers = {
    SAMPLE_DATA: () => {
      const values = { ...initialValues }
      console.log(values)
    },
    SHOW_INSPECTOR: () => {
      showInspector ? setShowInspector(false) : setShowInspector(true)
    }
  }

  const testPowerForPeriods = (
    rates,
    values,
    limit = 'min_power',
    createError
  ) => {
    const rate = values?.rate
    let valids = 0
    if (rates[rate] === undefined) return true
    for (let i = 1; i <= rates[rate]?.num_power_periods; i++) {
      const attr = i === 1 ? 'power' : `power${i}`
      const inLimit = limit.match('min')
        ? values[attr] >= rates[rate][limit]?.power
        : values[attr] <= rates[rate][limit]?.power
      inLimit && valids++
      values[attr] === undefined && valids++
    }

    if (valids >= rates[rate][limit]?.num_periods_apply) {
      return true
    }

    const lessThan =
      rates[rate]?.num_power_periods > rates[rate][limit]?.num_periods_apply
        ? 'SOME_PERIOD_MORE_THAN'
        : 'POWER_NO_LESS_THAN'

    return createError({
      message: t(limit.match('min') ? lessThan : 'POWER_NO_MORE_THAN', {
        value: rates[rate][limit]?.power
      })
    })
  }

  const validationSchemas = [
    Yup.object().shape({
      member: Yup.object().shape({
        number: Yup.string().required(t('NO_MEMBER_NUMBER')),
        vat: Yup.string().required(t('NO_MEMBER_VAT')),
        checked: Yup.bool()
          .required(t('NO_MEMBER_MATCH'))
          .oneOf([true], t('NO_MEMBER_MATCH'))
      })
    }),
    Yup.object().shape({
      supply_point: Yup.object().shape({
        cups: Yup.string()
          .required(t('CUPS_INVALID'))
          .min(18, t('CUPS_INVALID'))
          .test('statusError', t('CUPS_INVALID'), function () {
            return !(this.parent.status === 'error')
          })
          .test('statusError', t('CUPS_IN_PROCESS'), function () {
            return !(this.parent.status === 'busy')
          })
          .test('statusNew', t('CUPS_IS_ACTIVE'), function () {
            return !(this.parent.status === 'active')
          })
          .test('statusInvalid', t('INVALID_SUPPLY_POINT_CUPS'), function () {
            return !(this.parent.status === 'invalid')
          })
      }),
      contract: Yup.object().shape({
        has_service: Yup.bool()
          .required(t('UNSELECTED_NEW_SUPPLY_POINT'))
          .oneOf([true, false], t('UNSELECTED_NEW_SUPPLY_POINT'))
      })
    }),
    Yup.object().shape({
      supply_point: Yup.object().shape({
        address: Yup.string().required(t('NO_ADDRESS')),
        number: Yup.string().required(t('NO_NUMBER')),
        postal_code: Yup.string()
          .matches(/^\d*$/, t('NO_POSTALCODE'))
          .required(t('NO_POSTALCODE'))
          .min(5, t('NO_POSTALCODE')),
        state: Yup.object().shape({
          id: Yup.number().required(t('NO_STATE'))
        }),
        city: Yup.object().shape({
          id: Yup.number().required(t('NO_CITY'))
        }),
        is_housing: Yup.bool()
          .oneOf([true, false], t('NO_IS_HOUSING'))
          .test('CnaeNoHousing', t('INVALID_CNAE_NO_HOUSING'), function () {
            return !(
              this.parent.is_housing === false &&
              this.parent.cnae === CNAE_HOUSING
            )
          }),
        cnae: Yup.string()
          .required(t('INVALID_SUPPLY_POINT_CNAE'))
          .min(3, t('INVALID_SUPPLY_POINT_CNAE'))
          .test('CnaeNoHousing', t('INVALID_CNAE_NO_HOUSING'), function () {
            return !(
              this.parent.is_housing === false &&
              this.parent.cnae === CNAE_HOUSING
            )
          }),
        cnae_valid: Yup.bool()
          .required(t('INVALID_SUPPLY_POINT_CNAE'))
          .oneOf([true], t('INVALID_SUPPLY_POINT_CNAE')),
        supply_point_accepted: Yup.bool()
          .required(t('CUPS_VERIFY_LABEL'))
          .oneOf([true], t('CUPS_VERIFY_LABEL'))
      })
    }),
    Yup.object().shape({
      contract: Yup.object().shape({
        fare: Yup.string().test('required', t('NO_FARE_CHOSEN'), function () {
          return this.parent.has_service
            ? true
            : this.parent.moreThan15Kw
            ? true
            : this.parent.fare === 'dh' || this.parent.fare === 'nodh'
        }),
        rate: Yup.string().when('has_service', {
          is: true,
          then: Yup.string().required(t('NO_FARE_CHOSEN'))
        }),
        power: Yup.number()
          .required(t('NO_POWER_CHOSEN'))
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError
              )
            }
          }),
        power2: Yup.number()
          .test('required', t('NO_POWER_CHOSEN_P2'), function () {
            return rates[this.parent.rate]?.num_power_periods >= 2
              ? this.parent.power2
              : true
          })
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError
              )
            }
          }),
        power3: Yup.number()
          .test('required', t('NO_POWER_CHOSEN_P3'), function () {
            return rates[this.parent.rate]?.num_power_periods >= 3
              ? this.parent.power3
              : true
          })
          .test({
            name: 'minPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'min_power',
                this.createError
              )
            }
          })
          .test({
            name: 'maxPowerValue',
            test: function () {
              return testPowerForPeriods(
                rates,
                this.parent,
                'max_power',
                this.createError
              )
            }
          })
      })
    }),
    Yup.object().shape({
      self_consumption: Yup.object().shape({
        have_installation: Yup.bool().required(
          t('FILL_SELFCONSUMPTION_QUESTION')
        )
      })
    }),
    Yup.object().shape({
      self_consumption: Yup.object().shape({
        cau: Yup.string().required(t('FILL_SELFCONSUMPTION_CAU')),
        collective_installation: Yup.bool().required(
          t('FILL_SELFCONSUMPTION_COLLECTIVE_INSTALLATION')
        ),
        installation_power: Yup.number().required(
          t('FILL_SELFCONSUMPTION_INSTALLATION_POWER')
        ),
        installation_situation: Yup.string().required(
          t('FILL_SELFCONSUMPTION_INSTALLATION_SITUATION')
        ),
        technology: Yup.string().required(t('FILL_SELFCONSUMPTION_TECHNOLOGY')),
        aux_services: Yup.bool().required(
          t('FILL_SELFCONSUMPTION_AUX_SERVICES')
        ),
        rac_attachment: Yup.array()
          .required()
          .min(1, t('FILL_SELFCONSUMPTION_RAC_ATTACHMENT'))
      })
    }),
    Yup.object().shape({
      holder: Yup.object().shape({
        previous_holder: Yup.bool()
          .required(t('FILL_PREVIOUS_HOLDER'))
          .oneOf([true, false], t('FILL_PREVIOUS_HOLDER')),
        vat: Yup.string().required(t('FILL_NIF')),
        vatvalid: Yup.bool()
          .required(t('FILL_NIF'))
          .oneOf([true], t('FILL_NIF'))
      })
    }),
    Yup.object().shape({
      holder: Yup.object().shape({
        name: Yup.string().required(t('NO_NAME')),
        surname1: Yup.string().when('isphisical', {
          is: true,
          then: Yup.string().required(t('NO_SURNAME1'))
        }),
        proxyname: Yup.string().when('isphisical', {
          is: false,
          then: Yup.string().required(t('NO_PROXY_NAME'))
        }),
        proxynif: Yup.string().when('isphisical', {
          is: false,
          then: Yup.string().required(t('NO_PROXY_NIF'))
        }),
        proxynif_valid: Yup.bool().when('isphisical', {
          is: false,
          then: Yup.bool().required(t('FILL_NIF')).oneOf([true], t('FILL_NIF'))
        }),
        address: Yup.string().required(t('NO_ADDRESS')),
        postal_code: Yup.string()
          .matches(/^\d*$/, t('NO_POSTALCODE'))
          .required(t('NO_POSTALCODE')),
        state: Yup.object().shape({
          id: Yup.number().required(t('NO_STATE'))
        }),
        city: Yup.object().shape({
          id: Yup.number().required(t('NO_CITY'))
        }),
        email: Yup.string().required(t('NO_EMAIL')).email(t('NO_EMAIL')),
        email2: Yup.string()
          .required(t('NO_EMAIL'))
          .test('repeatEmail', t('NO_REPEATED_EMAIL'), function () {
            return this.parent.email === this.parent.email2
          }),
        phone1: Yup.string().min(9, t('NO_PHONE')).required(t('NO_PHONE')),
        language: Yup.string().required(t('NO_LANGUAGE'))
      }),
      legal_person_accepted: Yup.bool().test({
        name: 'isTheMemberVat',
        message: t('ACCEPT_LEGAL_PERSON'),
        test: function () {
          return !(
            this.parent.holder.isphisical === false &&
            this.parent.legal_person_accepted !== true
          )
        }
      }),
      privacy_policy_accepted: Yup.bool()
        .required(t('UNACCEPTED_PRIVACY_POLICY'))
        .oneOf([true], t('UNACCEPTED_PRIVACY_POLICY'))
    }),
    Yup.object().shape({
      payment: Yup.object().shape({
        voluntary_cent: Yup.bool()
          .required(t('NO_VOLUNTARY_DONATION_CHOICE_TAKEN'))
          .oneOf([false, true], t('NO_VOLUNTARY_DONATION_CHOICE_TAKEN'))
      })
    }),
    Yup.object().shape({
      payment: Yup.object().shape({
        iban: Yup.string().required(t('IBAN_ERROR')),
        iban_valid: Yup.bool()
          .required(t('IBAN_ERROR'))
          .oneOf([true], t('IBAN_ERROR')),
        sepa_accepted: Yup.bool()
          .required(t('IBAN_ERROR'))
          .oneOf([true], t('IBAN_ERROR'))
      })
    }),
    Yup.object().shape({
      terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS'))
    })
  ]

  const showProgress = false
  const MAX_STEP_NUMBER = 9

  const getActiveStep = (props) => {
    const url = t('DATA_PROTECTION_CONTRACT_URL')

    const steps = [
      <MemberIdentifier {...props} />,
      <CUPS {...props} />,
      <SupplyPoint {...props} />,
      <PowerFare rates={rates} {...props} />,
      <SelfConsumption {...props} />,
      <SelfConsumptionDetails {...props} />,
      <HolderIdentifier {...props} />,
      <PersonalData url={url} {...props} />,
      <VoluntaryCent {...props} />,
      <IBAN {...props} />,
      <Review {...props} />
    ]

    return steps[activeStep] || <></>
  }

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  const nextStep = (props) => {
    let next = activeStep + 1

    if (
      activeStep === 4 &&
      props.values.self_consumption.have_installation === false
    ) {
      next++
    }

    if (
      activeStep === 6 &&
      props.values.holder.vat === props.values.member.vat &&
      props.values.holder.isphisical
    ) {
      next++
      props.setFieldValue('privacy_policy_accepted', true)
    }

    const last = MAX_STEP_NUMBER
    props.submitForm().then(() => {
      if (props.isValid) {
        setActiveStep(Math.min(next, last))
        props.validateForm()
        props.setTouched({})
      }
    })
  }

  const prevStep = (props) => {
    let prev = activeStep - 1
    if (
      activeStep === 6 &&
      props.values.self_consumption.have_installation === false
    ) {
      prev--
    }

    if (
      activeStep === 8 &&
      props.values.holder.vat === props.values.member.vat &&
      props.values.holder.isphisical
    ) {
      prev--
      props.setFieldValue('privacy_policy_accepted', false)
    }
    setActiveStep(Math.max(0, prev))
    if (completed) {
      setCompleted(false)
      setError(false)
    }
    props.submitForm().then(() => {
      props.validateForm()
      props.setTouched({})
    })
  }

  const initialValues = {
    holder: {
      vat: '',
      vatvalid: false,
      previous_holder: '',
      isphisical: true,
      proxynif_valid: false,
      proxynif: '',
      proxyname: '',
      name: '',
      address: '',
      postal_code: '',
      state: { id: '' },
      city: { id: '' },
      surname1: '',
      surname2: '',
      email: '',
      email2: '',
      phone1: '',
      phone2: '',
      language: `${i18n.language}_ES`
    },
    supply_point: {
      cups: '',
      status: false,
      address: '',
      number: '',
      floor: '',
      door: '',
      postal_code: '',
      state: { id: '' },
      city: { id: '' },
      is_housing: '',
      cnae: '',
      cnae_valid: false,
      attachments: [],
      supply_point_accepted: false
    },
    self_consumption: {
      have_installation: ''
    },
    contract: {
      has_service: '',
      rate: '',
      power: '',
      power2: '',
      power3: '',
      phases: '',
      fare: '',
      moreThan15Kw: false
    },
    member: {
      number: '',
      vat: '',
      full_name: '',
      checked: false,
      proxynif: '',
      proxyname: '',
      name: '',
      address: '',
      postal_code: '',
      state: { id: '' },
      city: { id: '' },
      surname1: '',
      surname2: '',
      email: '',
      email2: '',
      phone1: '',
      phone2: '',
      language: `${i18n.language}_ES`
    },
    payment: {
      iban: '',
      sepa_accepted: false,
      voluntary_cent: ''
    },
    privacy_policy_accepted: false,
    terms_accepted: false,
    legal_person_accepted: false
  }

  const trackSucces = () => {
    ReactGA.initialize(GA_TRACKING_ID)
    ReactGA.pageview('/es/contratacion-realizada/')
  }

  const handlePost = async (values) => {
    setSending(true)
    const data = normalizeContract(values)
    await contract(data)
      .then((response) => {
        if (response?.state === true) {
          setError(false)
          setResult({ contract_number: response?.data?.contract_id })
          trackSucces()
        } else {
          setError(true)
        }
      })
      .catch((error) => {
        const errorResp = error?.response?.data?.data
          ? error?.response?.data?.data
          : { code: 'UNEXPECTED' }
        setError(errorResp)
      })
    setSending(false)
    setActiveStep(MAX_STEP_NUMBER)
    setCompleted(true)
  }

  return (
    <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
      <Container maxWidth="md" disableGutters={true}>
        <Formik
          onSubmit={() => {}}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          validateOnMount={true}>
          {(props) => (
            <>
              <div>
                <Form className={classes.root} noValidate autoComplete="off">
                  {
                    <Paper elevation={0} className={classes.stepContainer}>
                      {showProgress && (
                        <LinearProgress
                          variant={sending ? 'indeterminate' : 'determinate'}
                          value={(activeStep / MAX_STEP_NUMBER) * 100}
                        />
                      )}

                      <Box mx={0} mb={3}>
                        {completed ? (
                          error ? (
                            <Failure error={error} />
                          ) : (
                            <Success result={result} />
                          )
                        ) : (
                          getActiveStep(props)
                        )}
                      </Box>
                      <Box mx={0} mt={1} mb={3}>
                        <div className={classes.actionsContainer}>
                          {result?.contract_number === undefined && (
                            <Button
                              data-cy="prev"
                              className={classes.button}
                              startIcon={<ArrowBackIosIcon />}
                              disabled={activeStep === 0 || sending}
                              onClick={() => prevStep(props)}>
                              {t('PAS_ANTERIOR')}
                            </Button>
                          )}
                          {activeStep < MAX_STEP_NUMBER - 1 ? (
                            <Button
                              type="button"
                              data-cy="next"
                              className={classes.button}
                              variant="contained"
                              color="primary"
                              endIcon={<ArrowForwardIosIcon />}
                              disabled={!props.isValid}
                              onClick={() => nextStep(props)}>
                              {t('SEGUENT_PAS')}
                            </Button>
                          ) : (
                            !completed && (
                              <Button
                                type="button"
                                data-cy="submit"
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                startIcon={
                                  sending ? (
                                    <CircularProgress size={24} />
                                  ) : (
                                    <SendIcon />
                                  )
                                }
                                disabled={sending || !props.isValid}
                                onClick={() => handlePost(props.values)}>
                                {t('SEND')}
                              </Button>
                            )
                          )}
                        </div>
                      </Box>
                    </Paper>
                  }
                </Form>
              </div>
              {showInspector && <DisplayFormikState {...props} />}
            </>
          )}
        </Formik>
      </Container>
    </GlobalHotKeys>
  )
}

export default Contract
