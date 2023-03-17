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

const contractJSON = JSON.parse(
  document.getElementById('contract-data').textContent
)

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
    /* 
      cont params = {...contractJSON,...values} 
      modify_tariff(params)
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
      }) */
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
                        <IndexadaContractDetails {...formikProps.values} data={contractJSON} />
                      ) : null}

                      {activeStep === 0 ? (
                        <IndexadaIntro {...formikProps} />
                      ) : null}
                      {activeStep === 1 ? (
                        <IndexadaImportantInfo {...formikProps} />
                      ) : null}
                      {activeStep === 2 ? (
                        <IndexadaReview
                        contractValues={contractJSON}
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
                                {t('TRAMITAR CANVI DE TARIFA')}
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
                          title={'Has solicitat la tarifa comercialitzadora:'}
                          subtitle={"2.0TD INDEXADA Península/Canàries/Balears"}
                          description={'Ara, rebràs un correu amb les condicions generals i particulars de la tarifa indexada contractada i un cop finalitzat el cicle de facturació actual, se t\'aplicarà la tarifa indexada '}
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
