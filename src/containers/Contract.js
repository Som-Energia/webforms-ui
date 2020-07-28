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
import Paper from '@material-ui/core/Paper'

import DisplayFormikState from '../components/DisplayFormikState'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

import PowerFare from './Contract/PowerFare'
import VoluntaryCent from './HolderChange/VoluntaryCent'
import IBAN from './HolderChange/IBAN'
import Review from './Contract/Review'

import { getRates } from '../services/api'

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

const Contract = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const [showInspector, setShowInspector] = useState(true)
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
      setShowInspector(true)
    }
  }

  const validationSchemas = [
    Yup.object().shape({
      contract: Yup.object().shape({
        rate: Yup.string()
          .required(t('NO_FARE_CHOSEN')),
        power: Yup.number()
          .required(t('NO_POWER_CHOSEN'))
          .test('minPowerValue',
            t('POWER_NO_LESS_THAN'),
            function () {
              return this.parent.power > rates[this.parent.rate]?.min_power
            })
          .test('maxPowerValue',
            t('POWER_NO_MORE_THAN'),
            function () {
              return this.parent.power < rates[this.parent.rate]?.max_power
            })
          .test('nondomestic',
            t('ALGUN_DELS_TRES_PERIODES_MAJOR_QUE_15'),
            function () {
              return !(this.parent.rate != '3.0A' && this.parent.power <= 15 && this.parent.power2 <= 15 && this.parent.power3 <= 15)
            }),
        power2: Yup.number()
          .test('required',
            t('NO_POWER_CHOSEN_P2'),
            function () {
              return !(rates[this.parent.rate]?.num_power_periods > 1 && this.parent.power2)
            })
          .test('minPowerValue',
            t('POWER_NO_LESS_THAN'),
            function () {
              return this.parent.power2 > rates[this.parent.rate]?.min_power
            })
          .test('maxPowerValue',
            t('POWER_NO_MORE_THAN'),
            function () {
              return this.parent.power2 < rates[this.parent.rate]?.max_power
            })
          .test('nondomestic',
            t('ALGUN_DELS_TRES_PERIODES_MAJOR_QUE_15'),
            function () {
              return !(this.parent.rate != '3.0A' && this.parent.power <= 15 && this.parent.power2 <= 15 && this.parent.power3 <= 15)
            }),
        power3: Yup.number()
          .test('required',
            t('NO_POWER_CHOSEN_P3'),
            function () {
              return rates[this.parent.rate]?.num_power_periods > 1 && this.parent.power3
            })
          .test('minPowerValue',
            t('POWER_NO_LESS_THAN'),
            function () {
              return this.parent.power3 > rates[this.parent.rate]?.min_power
            })
          .test('maxPowerValue',
            t('POWER_NO_MORE_THAN'),
            function () {
              return this.parent.power3 < rates[this.parent.rate]?.max_power
            })
          .test('nondomestic',
            t('ALGUN_DELS_TRES_PERIODES_MAJOR_QUE_15'),
            function () {
              console.log(this.parent.rate)
              return !(this.parent.rate != '3.0A' && this.parent.power <= 15 && this.parent.power2 <= 15 && this.parent.power3 <= 15)
            })
      })
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

  const MAX_STEP_NUMBER = 3

  const getActiveStep = (props) => {
    return <>
      { activeStep === 0 &&
        <PowerFare rates={rates} {...props} />
      }
      { activeStep === 1 &&
        <VoluntaryCent {...props} />
      }
      { activeStep === 2 &&
        <IBAN {...props} />
      }
      { activeStep === 3 &&
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
    contract: {
      rate: '',
      power: '',
      power2: '',
      power3: ''
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
    privacy_policy_accepted: false,
    terms_accepted: false

  }

  const handlePost = async (values) => {
    setSending(true)
    /*
    const data = normalizeHolderChange(values)
    await holderChange(data)
      .then(response => {
        const responseData = response?.data ? response.data : {}
        setResult(responseData)
        setError(false)
        setCompleted(true)
      })
      .catch(error => {
        const errorResp =
          error?.response?.data?.data
            ? error?.response?.data?.data
            : { code: 'UNEXPECTED' }
        setError(errorResp)
        setCompleted(true)
      })
    */
    setSending(false)
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
                      <Box mx={4} mb={3}>
                        { completed
                          ? error
                            ? <div error={error} />
                            : <div result={result} />
                          : getActiveStep(props)
                        }
                      </Box>
                      <Box mx={4} mt={1} mb={3}>
                        <div className={classes.actionsContainer}>
                          {
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
                            activeStep < MAX_STEP_NUMBER
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

export default Contract
