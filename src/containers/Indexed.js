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
import IndexedContractDetails from './Indexed/IndexedContractDetails'
import IndexedReview from './Indexed/IndexedReview'
import Failure from './Indexed/IndexedFailure'
import Success from './Success'
import { modify_tariff, can_modify_tariff } from 'services/api'
import Grid from '@material-ui/core/Grid'
import DropDownMenu from '../components/DropDownMenu'
import Loading from 'components/Loading'
import IndexedInfo from './Indexed/IndexedInfo'
import {checkIsTariff20} from '../services/utils'

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

  const { token, checkEnabled=true } = props
  const { language } = useParams()

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState()
  const [hasTargetTariff, setHasTargetTariff] = useState(false)
  const [loadingTariff, setLoadingTariff] = useState(checkEnabled)
  const [isTariff20] = useState(checkIsTariff20(contractJSON.tariff))

  const handlers = {
    SHOW_INSPECTOR: () => {
      setShowInspector(!showInspector)
    }
  }

  const sectionsJson = [
    {
      title: t('INDEXADA_GENERAL_CONDITIONS'),
      text: t('INDEXADA_GENERAL_CONDITIONS_TEXT')
    },
    {
      title: t('INDEXADA_SPECIFIC_CONDITIONS'),
      text: t('INDEXADA_SPECIFIC_CONDITIONS_TEXT')
    },
    { title: t('INDEXADA_MARGE'), text: t('INDEXADA_MARGE_TEXT') },
    {
      title: t('INDEXADA_DURADA'),
      text: t('INDEXADA_DURADA_TEXT', { tariff: hasTargetTariff })
    },
    { title: t('INDEXADA_DESESTIMENT'), text: t('INDEXADA_DESESTIMENT_TEXT') },
    {
      title: t('INDEXADA_PERSONAL_DATA_PROTECTION'),
      text: t('INDEXADA_PERSONAL_DATA_PROTECTION_TEXT')
    }
  ]

  const initialValues = {
    terms_accepted: false,
    indexed_terms_accepted: false,
    indexed_legal_terms_accepted: false
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

  const handlePost = (data) => {
    let params = {
      token: token,
      terms_accepted: data.terms_accepted,
      indexed_terms_accepted: data.indexed_terms_accepted,
      indexed_legal_terms_accepted: data.indexed_legal_terms_accepted
    }

    setLoading(true)
    modify_tariff(params)
      .then((response) => {
        setLoading(false)
        setCompleted(true)
        setResult(response)
      })
      .catch((error) => {
        setLoading(false)
        setCompleted(true)
        console.error(error)
        const errorResp = error?.response?.data?.error
          ? error?.response?.data?.error
          : { code: 'UNEXPECTED' }
        setError(errorResp)
      })
  }

  const checkCanModifyTariff = async () => {
    try {
      setLoadingTariff(true)
      let result = await can_modify_tariff(token)
      setLoadingTariff(false)
      setHasTargetTariff(result?.data?.target_tariff)
    } catch (error) {
      setLoadingTariff(false)
      setError(error?.response?.data?.error)
    }
  }

  useEffect(() => {
    checkEnabled && checkCanModifyTariff()
  }, [])

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
      indexed_terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS')),
      indexed_legal_terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS'))
    })
  ]

  if (!contractJSON.name || !contractJSON.cups) {
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
    <>
      {!loadingTariff ? (
        <GlobalHotKeys handlers={handlers} keyMap={keyMap}>
          {!checkEnabled || hasTargetTariff ? (
            <MuiPickersUtilsProvider utils={DayjsUtils}>
              <Grid container justifyContent="space-between">
                <Grid item xs={8}>
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
                                  <IndexedContractDetails
                                    {...formikProps.values}
                                    data={contractJSON}
                                    targetTariff={hasTargetTariff}
                                    isTariff20={isTariff20}
                                  />
                                ) : null}

                                {activeStep === 0 ? (
                                  <IndexedInfo
                                    isTariff20={isTariff20}
                                    desc={t('INDEXADA_INTRO_BODY', {
                                      url_general_conditions: t(
                                        'GENERAL_CONDITIONS_URL'
                                      ),
                                      url_specific_conditions: t(
                                        'SPECIFIC_CONDITIONS_URL'
                                      )
                                    })}
                                    {...formikProps}
                                  />
                                ) : null}
                                {activeStep === 1 ? (
                                  <IndexedInfo
                                    isTariff20={isTariff20}
                                    title={t('INDEXADA_INTRO_TITLE')}
                                    desc={t(isTariff20 ? 'INDEXADA_IMPORTANT_INFO_BODY' :'INDEXADA_IMPORTANT_INFO_BODY_30', {
                                      url_indexada_help: t(
                                        'TARIFF_INDEXADA_HELP_URL'
                                      )
                                    })}
                                    {...formikProps}
                                  />
                                ) : null}
                                {activeStep === 2 ? (
                                  <IndexedReview
                                    isTariff20={isTariff20}
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
                                        disabled={activeStep === 0 || loading}
                                        onClick={() => prevStep(formikProps)}>
                                        {t('PAS_ANTERIOR')}
                                      </Button>
                                    )}
                                    {activeStep < MAX_STEP_NUMBER - 1 ? (
                                      <Button
                                        type="button"
                                        data-cy="next"
                                        id="change-tariff-next-step-button"
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
                                          id="tariff-change-submit"
                                          className={classes.button}
                                          variant="contained"
                                          color="primary"
                                          startIcon={
                                            loading ? (
                                              <CircularProgress size={24} />
                                            ) : (
                                              <SendIcon />
                                            )
                                          }
                                          disabled={
                                            loading || !formikProps.isValid
                                          }
                                          onClick={() =>
                                            handlePost(formikProps.values)
                                          }>
                                          {t('INDEXADA_SUBMIT_BUTTON_TEXT')}
                                        </Button>
                                      )
                                    )}
                                  </div>
                                </Box>
                              </>
                            )}

                            {completed && (
                              <Paper
                                elevation={0}
                                className={classes.stepContainer}>
                                {result ? (
                                  <Success
                                    showHeader={false}
                                    title={t('INDEXADA_SUCCESS_PAGE_TITLE')}
                                    subtitle={
                                      '2.0TD INDEXADA Península/Canàries/Balears'
                                    }
                                    description={t(
                                      'INDEXADA_SUCCESS_PAGE_DESC'
                                    )}
                                  />
                                ) : (
                                  <Failure error={error} showHeader={false} />
                                )}
                              </Paper>
                            )}
                          </Container>
                        </Form>
                        {showInspector && (
                          <DisplayFormikState {...formikProps} />
                        )}
                      </>
                    )}
                  </Formik>
                </Grid>
                <Grid item xs={3}>
                  <DropDownMenu
                    title={t('INDEXADA_CONTRACT_CHARACTERISTICS')}
                    sections={sectionsJson}
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          ) : (
            <Failure error={error} showHeader={false} />
          )}
        </GlobalHotKeys>
      ) : (
        <Loading />
      )}
    </>
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
