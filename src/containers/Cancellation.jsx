import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import SendIcon from '@mui/icons-material/Send'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import dayjs from 'dayjs'
import 'dayjs/locale/ca'
import 'dayjs/locale/es'

import DisplayFormikState from '../components/DisplayFormikState'

import ContractDetails from './Cancellation/ContractDetails'
import CancellationWarning from './Cancellation/CancellationWarning'
import CancellationIntro from './Cancellation/CancellationIntro'
import CancellationDetails from './Cancellation/CancellationDetails'

import Failure from './Failure'
import Success from './Success'

import { cancelContract } from '../services/api'
import PrevButton from '../components/Buttons/PrevButton'
import NextButton from '../components/Buttons/NextButton'

const MAX_STEP_NUMBER = 2

const keyMap = {
  SAMPLE_DATA: 'ctrl+shift+1',
  SHOW_INSPECTOR: 'ctrl+shift+d'
}

const Cancellation = (props) => {
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
    contract_id: contract.id,
    contract_number: contract.number,
    contract_cups: contract.cups,
    cups_address: contract.address,
    cups: '',
    privacy_policy: false,
    terms_accepted: false,
    phone: '',
    validation_cups: '',
    date_action: null
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
    console.log(`csrfmiddlewaretoken: ${csrfInput?.value}`)

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
    Yup.object().shape({
      cups: Yup.string()
        .required(t('CUPS_INVALID'))
        .min(18, t('CUPS_INVALID'))
        .test('sameCups', t('NOT_MATCH'), function () {
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

  if (!contract.id || !contract.number || !contract.cups) {
    return (
      <Alert severity="error">
        <Typography
          variant="pagesubtitle"
          dangerouslySetInnerHTML={{
            __html: t('CANCELLATION_NO_AVAILABLE')
          }}
        />
      </Alert>
    )
  }

  return (
    <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
        <Formik
          onSubmit={() => { }}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          validateOnMount={true}>
          {(formikProps) => (
            <>
              <Form
                id="cancelForm"
                method="POST"
                sx={{
                  backgroundColor: 'secondary.light',
                  color: 'primary',
                  display: 'flex',
                  pb: '2rem'
                }}
                noValidate
                autoComplete="off">
                <Container maxWidth="lg" disableGutters={true}>
                  {!completed && (
                    <>
                      <ContractDetails {...formikProps.values} />

                      {activeStep === 0 && (
                        <CancellationIntro {...formikProps} />
                      )}
                      {activeStep === 1 && (
                        <CancellationDetails {...formikProps} />
                      )}
                      <CancellationWarning />
                      <Box mx={0} mt={2} mb={3}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            pt: '0.25rem'
                          }}>
                          {result?.contract_number === undefined && (
                            <PrevButton
                              disabled={activeStep === 0 || sending}
                              onClick={() => prevStep(formikProps)}
                              title={t('PAS_ANTERIOR')}
                            />
                          )}
                          {activeStep < MAX_STEP_NUMBER - 1 ? (
                            <NextButton
                              disabled={!formikProps.isValid}
                              onClick={() => nextStep(formikProps)}
                              title={t('SEGUENT_PAS')}
                            />
                          ) : (
                            !completed && (
                              <Button
                                data-cy="submit"
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
                        </Box>
                      </Box>
                    </>
                  )}

                  {completed && (
                    <Paper
                      elevation={0}
                      sx={{
                        padding: '4rem',
                        mt: 0,
                        mb: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'background.default'
                      }}>
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
      </LocalizationProvider>
    </GlobalHotKeys>
  )
}

export default Cancellation
