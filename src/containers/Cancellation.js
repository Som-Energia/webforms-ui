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

import ContractDetails from './Cancellation/ContractDetails'
import CancellationWarning from './Cancellation/CancellationWarning'
import CancellationIntro from './Cancellation/CancellationIntro'
import CancellationDetails from './Cancellation/CancellationDetails'

import Failure from './Failure'
import Success from './Success'

import { getNextBussinessDay } from '../services/utils'
import { cancelContract } from '../services/api'

const MAX_STEP_NUMBER = 2

const keyMap = {
  SAMPLE_DATA: 'ctrl+shift+1',
  SHOW_INSPECTOR: 'ctrl+shift+d'
}

const Cancellation = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const { token, contract } = props
  const { language } = useParams()
  const { id, number, cups, address } = contract
  const nextBussinesDay = getNextBussinessDay()

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(true)
  const [error, setError] = useState(false)
  const [result, setResult] = useState()

  const handlers = {
    SHOW_INSPECTOR: () => {
      setShowInspector(!showInspector)
    }
  }

  const initialValues = {
    contract_id: id,
    contract_number: number,
    contract_cups: cups,
    cups_address: address,
    cups: '',
    privacy_policy: false,
    terms_accepted: false,
    phone: '',
    validation_cups: '',
    date_action: dayjs(nextBussinesDay).format('DD/MM/YYYY')
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
    console.log(values)
    setSending(true)
    cancelContract(values)
      .then((response) => {
        setSending(false)
        setCompleted(true)
        setResult(response)
      })
      .catch((error) => {
        setSending(false)
        setCompleted(true)
        setError(error)
      })
  }

  useEffect(() => {
    language && i18n.changeLanguage(language)
    language ? dayjs.locale(language) : dayjs.locale('es')
  }, [language, i18n])

  const validationSchemas = [
    Yup.object().shape({}),
    Yup.object().shape({
      cups: Yup.string()
        .required(t('CUPS_INVALID'))
        .min(18, t('CUPS_INVALID'))
        .test('sameCups', t('CUPS_NO_MATCHING'), function () {
          return !(this.parent.contract_cups !== this.parent.cups)
        }),
      phone: Yup.string()
        .required(t('NO_PHONE'))
        .min(9, t('NO_PHONE'))
        .max(9, t('NO_PHONE')),
      privacy_policy: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS')),
      terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS'))
    })
  ]

  if (!id || !number || !cups) {
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
                      <ContractDetails {...formikProps.values} />
                      <CancellationWarning />

                      {activeStep === 0 && (
                        <CancellationIntro {...formikProps} />
                      )}
                      {activeStep === 1 && (
                        <CancellationDetails {...formikProps} />
                      )}

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
                        <Failure showHeader={false} />
                      )}
                    </Paper>
                  )}
                </Container>
                <input type="hidden" name="csrfmiddlewaretoken" value={token} />
              </Form>
              {showInspector && <DisplayFormikState {...formikProps} />}
            </>
          )}
        </Formik>
      </MuiPickersUtilsProvider>
    </GlobalHotKeys>
  )
}

export default Cancellation

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
