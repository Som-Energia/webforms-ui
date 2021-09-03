import React, { useState, useEffect, useRef } from 'react'

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

import VAT from './Member/VAT'
import PersonalData from './HolderChange/PersonalData'
import Payment from './Member/Payment'
import Review from './Member/Review'

import Failure from './Failure'
import Success from './Success'

import { member } from '../services/api'
import { normalizeMember } from '../services/utils'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative'
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

const Member = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const formTPV = useRef(null)

  const [showInspector, setShowInspector] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState()

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
      member: Yup.object().shape({
        vat: Yup.string()
          .required(t('FILL_NIF'))
          .matches(/(^[A-GI-Z0-9])/, t('CIF_COMMUNITY_OWNERS')),
        vatvalid: Yup.bool().required(t('FILL_NIF'))
          .oneOf([true], t('FILL_NIF'))
      })
    }),
    Yup.object().shape({
      member: Yup.object().shape({
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
        state: Yup.object().shape({
          id: Yup.number()
            .required(t('NO_STATE'))
        }),
        city: Yup.object().shape({
          id: Yup.number()
            .required(t('NO_CITY'))
        }),
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
        phone2: Yup.string().min(9, t('NO_PHONE')),    
        language: Yup.string().required(t('NO_LANGUAGE'))
      }),
      legal_person_accepted: Yup.bool()
        .test({
          name: 'isTheMemberVat',
          message: t('ACCEPT_LEGAL_PERSON'),
          test: function () {
            return !(this.parent.member.isphisical === false && this.parent.legal_person_accepted !== true)
          }
        }),
      privacy_policy_accepted: Yup.bool()
        .required(t('UNACCEPTED_PRIVACY_POLICY'))
        .oneOf([true], t('UNACCEPTED_PRIVACY_POLICY'))
    }),
    Yup.object().shape({
      payment: Yup.object().shape({
        payment_method: Yup.string()
          .required(t('INVALID_PAYMENT_METHOD'))
          .oneOf(['iban', 'credit_card'], t('INVALID_PAYMENT_METHOD')),
        iban: Yup.string()
          .when('payment_method', {
            is: 'iban',
            then: Yup.string().required(t('IBAN_ERROR'))
          }),
        iban_valid: Yup.bool()
          .when('payment_method', {
            is: 'iban',
            then: Yup.bool().required(t('IBAN_ERROR'))
              .oneOf([true], t('IBAN_ERROR'))
          }),
        sepa_accepted: Yup.bool()
          .when('payment_method', {
            is: 'iban',
            then: Yup.bool().required(t('IBAN_ERROR'))
              .oneOf([true], t('IBAN_ERROR'))
          })
      })
    }),
    Yup.object().shape({
      terms_accepted: Yup.bool().required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS'))
    })
  ]

  const MAX_STEP_NUMBER = 4
  const showProgress = false

  const getActiveStep = (props) => {
    return <>
      { activeStep === 0 &&
        <VAT {...props} />
      }
      { activeStep === 1 &&
        <PersonalData entity='member' {...props} />
      }
      { activeStep === 2 &&
        <Payment {...props} />
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
    let next = activeStep + 1
    if (activeStep === 4 && props.values.holder.vat === props.values.member.vat && props.values.holder.isphisical) {
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

  const prevStep = props => {
    let prev = activeStep - 1
    if (activeStep === 6 && props.values.holder.vat === props.values.member.vat && props.values.holder.isphisical) {
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
    member: {
      number: '',
      vat: '',
      vatvalid: false,
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
    payment: {
      iban: '',
      sepa_accepted: false,
      payment_method: ''
    },
    privacy_policy_accepted: false,
    terms_accepted: false,
    legal_person_accepted: false,
    urlok: t('NEWMEMBER_OK_REDIRECT_URL'),
    urlko: t('NEWMEMBER_KO_REDIRECT_URL')
  }

  const handleError = (error) => {
    let errorCode = 'UNEXPECTED'
    if (error?.data?.invalid_fields.length &&
      error?.data?.invalid_fields[0]?.field &&
      error?.data?.invalid_fields[0]?.error) {
      errorCode = `${error?.data?.invalid_fields[0]?.field}_${error?.data?.invalid_fields[0].error}`
    }
    setError({ code: errorCode.toUpperCase() })
    setCompleted(true)
  }

  const handlePost = async (values) => {
    setSending(true)
    const data = normalizeMember(values)
    await member(data)
      .then(response => {
        if (response?.state === true) {
          setError(false)
          if (response?.data?.endpoint) {
            setData(response?.data)
            formTPV.current.submit()
          } else {
            setCompleted(true)
          }
        } else {
          handleError(response)
        }
      })
      .catch(error => {
        handleError(error?.response?.data)
      })
    setSending(false)
    setActiveStep(MAX_STEP_NUMBER)
  }

  return (
    <GlobalHotKeys handlers={handlers}>
      <Container maxWidth="md" disableGutters={true}>
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
                <Form className={classes.root} noValidate autoComplete="off">
                  {
                    <Paper elevation={0} className={classes.stepContainer}>
                      {
                        showProgress &&
                          <LinearProgress variant={sending ? 'indeterminate' : 'determinate'} value={ (activeStep / MAX_STEP_NUMBER) * 100 } />
                      }

                      <Box mx={0} mb={3}>
                        { completed
                          ? error
                            ? <Failure error={error} />
                            : <Success description={t('NEWMEMBER_OK_DESCRIPTION')} />
                          : getActiveStep(props)
                        }
                      </Box>
                      <Box mx={0} mt={0} mb={3}>
                        <div className={classes.actionsContainer}>
                          {
                            (!completed || error) &&
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
                                data-cy="submit"
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
        {
          data?.payment_data &&
          <form ref={formTPV} action={data.endpoint} method="POST">
            { Object.keys(data.payment_data).map(key =>
              <input key={key} type="hidden" name={key} value={data.payment_data[key]} />
            )}
          </form>
        }
      </Container>
    </GlobalHotKeys>
  )
}

export default Member
