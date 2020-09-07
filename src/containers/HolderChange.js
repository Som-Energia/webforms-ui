import React, { useState, useEffect } from 'react'
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

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

import VAT from './HolderChange/VAT'
import CUPS from './HolderChange/CUPS'
import PersonalData from './HolderChange/PersonalData'
import BecomeMember from './HolderChange/BecomeMember'
import VoluntaryCent from './HolderChange/VoluntaryCent'
import SpecialCases from './HolderChange/SpecialCases'
import IBAN from './HolderChange/IBAN'
import Review from './HolderChange/Review'
import Success from './HolderChange/Success'
import Failure from './HolderChange/Failure'

import data from '../data/HolderChange/data.json'

import DisplayFormikState from '../components/DisplayFormikState'

import { holderChange } from '../services/api'
import { normalizeHolderChange } from '../services/utils'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative'
  },
  stepContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
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

function HolderChange (props) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  // const [showAll, setShowAll] = useState(false)
  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})

  const handlers = {
    SAMPLE_DATA: () => {
      const values = { ...initialValues, ...data }
      console.log(values)
    },
    SHOW_INSPECTOR: () => {
      setShowInspector(true)
    }
  }

  const validationSchemas = [
    Yup.object().shape({
      holder: Yup.object().shape({
        vat: Yup.string().required(t('FILL_NIF')),
        vatvalid: Yup.bool().required(t('FILL_NIF'))
          .oneOf([true], t('FILL_NIF'))
      })
    }),
    Yup.object().shape({
      supply_point: Yup.object().shape({
        cups: Yup.string().required(t('CUPS_INVALID'))
          .min(18, t('CUPS_INVALID'))
          .test('statusError',
            t('CUPS_INVALID'),
            function () { return !(this.parent.status === 'error') })
          .test('statusError',
            t('CUPS_IN_PROCESS'),
            function () { return !(this.parent.status === 'busy') })
          .test('statusNew',
            t('CUPS_SHOULD_BE_ACTIVE'),
            function () { return !(this.parent.status === 'new') })
          .test('statusInvalid',
            t('INVALID_SUPPLY_POINT_CUPS'),
            function () { return !(this.parent.status === 'invalid') }),
        verified: Yup.bool().required(t('MARK_ADDRESS_CONFIRMATION_BOX'))
          .oneOf([true], t('MARK_ADDRESS_CONFIRMATION_BOX'))
      })
    }),
    Yup.object().shape({
      holder: Yup.object().shape({
        name: Yup.string()
          .required(t('NO_NAME')),
        surname1: Yup.string()
          .when('isphisical', {
            is: true,
            then: Yup.string()
              .required(t('NO_SURNAME1'))
          }),
        proxyname: Yup.string()
          .when('isphisical', {
            is: false,
            then: Yup.string()
              .required(t('NO_PROXY_NAME'))
          }),
        proxynif: Yup.string()
          .when('isphisical', {
            is: false,
            then: Yup.string()
              .required(t('NO_PROXY_NIF'))
          }),
        proxynif_valid: Yup.bool()
          .when('isphisical', {
            is: false,
            then: Yup.bool().required(t('FILL_NIF'))
              .oneOf([true], t('FILL_NIF'))
          }),
        address: Yup.string()
          .required(t('NO_ADDRESS')),
        postal_code: Yup.string()
          .matches(/^\d*$/, t('NO_POSTALCODE'))
          .required(t('NO_POSTALCODE')),
        state: Yup.string()
          .required(t('NO_STATE')),
        city: Yup.string()
          .required(t('NO_CITY')),
        email: Yup.string()
          .required(t('NO_EMAIL'))
          .email(t('NO_EMAIL')),
        email2: Yup.string()
          .test('repeatEmail',
            t('NO_REPEATED_EMAIL'),
            function () {
              return this.parent.email === this.parent.email2
            }),
        phone1: Yup.string()
          .min(9, t('NO_PHONE'))
          .required(t('NO_PHONE')),
        language: Yup.string().required(t('NO_LANGUAGE'))
      }),
      privacy_policy_accepted: Yup.bool()
        .required(t('UNACCEPTED_PRIVACY_POLICY'))
        .oneOf([true], t('UNACCEPTED_PRIVACY_POLICY'))
    }),
    Yup.object().shape({
    }),
    Yup.object().shape({
      payment: Yup.object().shape({
        voluntary_cent: Yup.bool()
          .required(t('NO_VOLUNTARY_DONATION_CHOICE_TAKEN'))
          .oneOf([false, true], t('NO_VOLUNTARY_DONATION_CHOICE_TAKEN'))
      })
    }),
    Yup.object().shape({
      especial_cases: Yup.object().shape({
        attachments: Yup.object()
          .when('reason_death', {
            is: true,
            then: Yup.object().shape({
              death: Yup.array()
                .min(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .max(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .required(t('ELECTRODEP_ATTACH_REQUIRED'))
            })
          })
          .when('reason_electrodep', {
            is: true,
            then: Yup.object().shape({
              medical: Yup.array()
                .min(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .max(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .required(t('ELECTRODEP_ATTACH_REQUIRED')),
              resident: Yup.array()
                .min(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .max(1, t('ELECTRODEP_ATTACH_REQUIRED'))
                .required(t('ELECTRODEP_ATTACH_REQUIRED'))
            })
          })
      })
    }),
    Yup.object().shape({
      payment: Yup.object().shape({
        iban: Yup.string().required(t('IBAN_ERROR')),
        iban_valid: Yup.bool().required(t('IBAN_ERROR'))
          .oneOf([true], t('IBAN_ERROR')),
        sepa_accepted: Yup.bool().required(t('IBAN_ERROR'))
          .oneOf([true], t('IBAN_ERROR'))
      })
    }),
    Yup.object().shape({
      terms_accepted: Yup.bool().required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS'))
    })
  ]

  const MAX_STEP_NUMBER = 8

  const getActiveStep = (props) => {
    const url = t("DATA_PROTECTION_HOLDERCHANGE_URL")
    return <>
      { activeStep === 0 &&
        <VAT {...props} />
      }
      { activeStep === 1 &&
        <CUPS {...props} />
      }
      { activeStep === 2 &&
        <PersonalData url={url} {...props} />
      }
      { activeStep === 3 &&
        <BecomeMember {...props} />
      }
      { activeStep === 4 &&
        <VoluntaryCent {...props} />
      }
      { activeStep === 5 &&
        <SpecialCases {...props} />
      }
      { activeStep === 6 &&
        <IBAN {...props} />
      }
      { activeStep === 7 &&
        <Review {...props} />
      }
    </>
  }

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  const nextStep = props => {
    const next = activeStep + 1
    const last = MAX_STEP_NUMBER
    props.submitForm().then(() => {
      if (props.isValid) {
        setActiveStep(Math.min(next, last))
        props.validateForm()
        props.setTouched({})
      }
    })
  }

  const prevStep = props => {
    const prev = activeStep - 1
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

  const handlePost = async (values) => {
    setSending(true)
    const data = normalizeHolderChange(values)
    await holderChange(data)
      .then(response => {
        const responseData = response?.data ? response.data : {}
        setResult(responseData)
        setError(false)
        setCompleted(true)
      })
      .catch(error => {
        console.log(error?.response)
        const errorResp =
          error?.response?.data?.data
            ? error?.response?.data?.data
            : { code: 'UNEXPECTED' }
        console.log(errorResp)
        setError(errorResp)
        setCompleted(true)
      })
    setActiveStep(MAX_STEP_NUMBER)
    setSending(false)
  }

  const initialValues = {
    holder: {
      vat: '',
      vatvalid: false,
      isphisical: true,
      proxynif_valid: false,
      state: { id: '' },
      city: { id: '' },
      proxynif: '',
      proxyname: '',
      name: '',
      address: '',
      postal_code: '',
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
      verified: false
    },
    member: {
      become_member: '',
      invite_token: false
    },
    payment: {
      iban: '',
      sepa_accepted: false,
      voluntary_cent: ''
    },
    especial_cases: {
      reason_death: false,
      reason_merge: false,
      reason_electrodep: false,
      attachments: {}
    },
    privacy_policy_accepted: false,
    terms_accepted: false
  }

  return (
    <GlobalHotKeys handlers={handlers}>
      <Container maxWidth="md">
        <Formik
          onSubmit={() => {}}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          validateOnMount={true}
        >
          {props => (
            <>
              <div>
                <Form className={classes.root} noValidate>
                  {
                    <Paper elevation={0} className={classes.stepContainer}>
                      <LinearProgress variant={sending ? 'indeterminate' : 'determinate'} value={ (activeStep / MAX_STEP_NUMBER) * 100 } />
                      <Box mx={4} mb={3}>
                        { completed
                          ? error
                            ? <Failure error={error} />
                            : <Success result={result} />
                          : getActiveStep(props)
                        }
                      </Box>
                      <Box mx={4} mt={1} mb={3}>
                        <div className={classes.actionsContainer}>
                          {
                            result?.contract_number === undefined &&
                            <Button
                              data-cy="prev"
                              className={classes.button}
                              startIcon={<ArrowBackIosIcon />}
                              disabled={(activeStep === 0) || sending}
                              onClick={() => prevStep(props)}
                            >
                              {t('PAS_ANTERIOR')}
                            </Button>

                          }
                          {
                            activeStep < MAX_STEP_NUMBER - 1
                              ? <Button
                                type="button"
                                data-cy="next"
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowForwardIosIcon />}
                                disabled={!props.isValid}
                                onClick={() => nextStep(props)}
                              >
                                {t('SEGUENT_PAS')}
                              </Button>
                              : !completed && <Button
                                type="button"
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                startIcon={ sending ? <CircularProgress size={24} /> : <SendIcon /> }
                                disabled={sending || !props.isValid}
                                onClick={() => handlePost(props.values)}
                              >
                                {t('SEND')}
                              </Button>
                          }
                        </div>
                      </Box>
                    </Paper>
                  }
                </Form>
              </div>
              { showInspector &&
                <DisplayFormikState {...props} />
              }
            </>
          )}
        </Formik>
      </Container>
    </GlobalHotKeys>
  )
}

export default HolderChange
