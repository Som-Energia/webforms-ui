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

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState({})

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
      holder: Yup.object().shape({
        vat: Yup.string().required(t('FILL_NIF')),
        vatvalid: Yup.bool().required(t('FILL_NIF'))
          .oneOf([true], t('FILL_NIF'))
      })
    })
  ]

  const MAX_STEP_NUMBER = 2

  const getActiveStep = (props) => {
    return <>
      { activeStep === 0 &&
        <div {...props} />
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
