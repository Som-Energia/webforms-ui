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
import Alert from '@material-ui/lab/Alert'
import Typography from '@material-ui/core/Typography'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'

import DisplayFormikState from '../components/DisplayFormikState'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

import ContractDetails from './Cancellation/ContractDetails'
import CancellationIntro from './Cancellation/CancellationIntro'
import CancellationDetails from './Cancellation/CancellationDetails'

const MAX_STEP_NUMBER = 2

const keyMap = {
  SAMPLE_DATA: 'ctrl+shift+1',
  SHOW_INSPECTOR: 'ctrl+shift+d'
}

const Cancellation = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})

  const handlers = {
    SHOW_INSPECTOR: () => {
      setShowInspector(!showInspector)
    }
  }

  const initialValues = {
    contract_number: '0091821',
    cups_address: 'Tramuntana, 4, 1r 1a 17162 (Bescanó)'
  }

  const nextStep = () => {
    const next = activeStep + 1
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = () => {
    const prev = activeStep - 1
    setActiveStep(Math.max(0, prev))
  }

  const handlePost = () => {
    document.getElementById('cancelForm').submit()
  }

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  const validationSchemas = [
    Yup.object().shape({}),
    Yup.object().shape({
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
    })
  ]

  return (
    <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <Formik
          onSubmit={() => {}}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          validateOnMount={true}>
          {(props) => (
            <Form
              id="cancelForm"
              method="POST"
              className={classes.root}
              noValidate
              autoComplete="off">
              <Container maxWidth="lg" disableGutters={true}>
                <ContractDetails {...props.values} />
                {activeStep === 0 && <CancellationIntro />}
                {activeStep === 1 && <CancellationDetails />}
                <Box mt={1}>
                  <Alert severity="warning">
                    <Typography
                      className={classes.disclaimer}
                      variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: t('CANCELLATION_DISCLAIMER')
                      }}
                    />
                  </Alert>
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
                          {t('TRAMITAR_BAJA')}
                        </Button>
                      )
                    )}
                  </div>
                </Box>
              </Container>
            </Form>
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
