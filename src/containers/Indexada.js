import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'

import dayjs from 'dayjs'
import 'dayjs/locale/ca'
import 'dayjs/locale/es'

import DisplayFormikState from '../components/DisplayFormikState'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

import IndexadaContractDetails from './Indexada/IndexadaContractDetails'
import IndexadaIntro from './Indexada/IndexadaIntro'
import IndexadaImportantInfo from './Indexada/IndexadaImportantInfo'
import IndexadaReview from './Indexada/IndexadaReview'

import Failure from './Failure'
import Success from './Success'

import { cancelContract } from 'services/api'

const contractJSON = {
  holder: {
    vat: '58291270R',
    previousHolder: true,
    name: 'David',
    surname1: 'Palomo',
    surname2: 'Romero',
    postalCode: '17003',
    address: 'Percebe, nº 13',
    stateCode: '20',
    cityCode: '5386',
    email: 'david.palomo@somenergia.coop',
    phone1: '636696969',
    phone2: '636696969',
    language: 'ca_ES',
    voluntaryCent: true,
    iban: 'ES77 1234 1234 1612 3456 7890',
    badIban: 'ES77 1234 1234 1612 3456 AAAA',
    badEmail: 'davidpalomosomenergiacoop',
    isphisical: true
  },
  member: {
    number: '38434',
    vat: '40323835M',
    badVat: '58291270J'
  },
  supplyPoint: {
    cups: 'ES0021316182488672PV',
    hasService: true,
    hasNoService: false,
    address: 'Pedro López',
    number: '13',
    postalCode: '17003',
    state: '20',
    city: '5386',
    isHousing: true,
    cnae: '9820',
    badCups: 'ESO8249878173OO148BZ',
    invalidCups: 'ES9803463008824117ZQ',
    validCups: 'ES0021316182488672PV'
  },
  fare20A: '2.0A',
  fare21: '2.1DHA',
  fare30A: '3.0A',
  power: 4.4,
  power2: 8,
  power3: 10,
  power6: 16,
  phase: 'mono',
  fare: 'nodh',
  juridicMember: {
    number: '61444',
    vat: 'B07121528'
  },
  juridicHolder: {
    vat: 'B07121528',
    proxynif: '40323835M',
    previousHolder: true,
    proxyname: 'David Palomo',
    name: 'Testing, SL'
  },
  selfConsumption: {
    have_installation: true,
    cau: 'ES0353501028615353EEA000',
    collective_installation: true,
    installation_power: '3.5',
    installation_type: '01',
    aux_services: false,
    attachments: ['file.png'],
    technology: 'b11'
  }
}

const MAX_STEP_NUMBER = 3

const keyMap = {
  SAMPLE_DATA: 'ctrl+shift+1',
  SHOW_INSPECTOR: 'ctrl+shift+d'
}

const Indexada = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const { contract } = props
  const { language } = useParams()

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState()

  const handlers = {
    SHOW_INSPECTOR: () => {
      setShowInspector(!showInspector)
    }
  }

  const initialValues = {
    terms_accepted: false,
    indexada_terms_accepted: false
  }

  const nextStep = (props) => {
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

  const prevStep = (props) => {
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

  const handlePost = (values) => {
    setSending(true)
    const csrfInput = document.querySelector(
      "input[name='csrfmiddlewaretoken']"
    )

    const params = { ...values, csrfToken: csrfInput?.value }

    cancelContract(params)
      .then((response) => {
        setSending(false)
        setCompleted(true)
        setResult(response)
      })
      .catch((error) => {
        setSending(false)
        setCompleted(true)
        console.error(error)
        const errorResp = error?.response?.data?.error
          ? error?.response?.data?.error
          : { code: 'UNEXPECTED' }
        setError(errorResp)
      })
  }

  useEffect(() => {
    language && i18n.changeLanguage(language)
    language ? dayjs.locale(language) : dayjs.locale('es')
  }, [language, i18n])

  const validationSchemas = [
    Yup.object().shape({}),
    Yup.object().shape({}),
    Yup.object().shape({
      terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS')),
      indexada_terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS'))
    })
  ]

  if (!contract.id || !contract.number || !contract.cups) {
    return (
      <Alert severity="error">
        <Typography
          className={classes.disclaimer}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('CANCELLATION_NO_AVAILABLE')
          }}
        />
      </Alert>
    )
  }

  return (
    <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <Formik
          onSubmit={() => {}}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          validateOnMount={true}>
          {(formikProps) => (
            <>
              <Form
                id="cancelForm"
                method="POST"
                className={classes.root}
                noValidate
                autoComplete="off">
                <Container maxWidth="lg" disableGutters={true}>
                  {!completed && (
                    <>
                      {activeStep !== 2 ? (
                        <IndexadaContractDetails {...formikProps.values} />
                      ) : null}

                      {activeStep === 0 ? (
                        <IndexadaIntro {...formikProps} />
                      ) : null}
                      {activeStep === 1 ? (
                        <IndexadaImportantInfo {...formikProps} />
                      ) : null}
                      {activeStep === 2 ? (
                        <IndexadaReview
                          contractJson={contractJSON}
                          values={contractJSON}
                          {...formikProps}
                        />
                      ) : null}
                      <Box mx={0} mt={2} mb={3}>
                        <div className={classes.actionsContainer}>
                          {result?.contract_number === undefined && (
                            <Button
                              data-cy="prev"
                              className={classes.button}
                              startIcon={<ArrowBackIosIcon />}
                              disabled={activeStep === 0 || sending}
                              onClick={() => prevStep(formikProps)}>
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
                              disabled={!formikProps.isValid}
                              onClick={() => nextStep(formikProps)}>
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
                                disabled={sending || !formikProps.isValid}
                                onClick={() => handlePost(formikProps.values)}>
                                {t('TRAMITAR_BAJA')}
                              </Button>
                            )
                          )}
                        </div>
                      </Box>
                    </>
                  )}

                  {completed && (
                    <Paper elevation={0} className={classes.stepContainer}>
                      {result ? (
                        <Success
                          showHeader={false}
                          title={t('CANCELLATION_SUCCESS_TITLE')}
                          description={t('CANCELLATION_SUCCESS_DESC')}
                        />
                      ) : (
                        <Failure error={error} showHeader={false} />
                      )}
                    </Paper>
                  )}
                </Container>
              </Form>
              {showInspector && <DisplayFormikState {...formikProps} />}
            </>
          )}
        </Formik>
      </MuiPickersUtilsProvider>
    </GlobalHotKeys>
  )
}

export default Indexada

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f2f2f2',
    color: theme.palette.text.primary,
    display: 'flex',
    paddingBottom: '2rem'
  },
  stepContainer: {
    padding: '4rem',
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
    justifyContent: 'space-between',
    paddingTop: '0.25rem'
  },
  disclaimer: {
    fontSize: '14px',
    fontWeight: 400
  }
}))
