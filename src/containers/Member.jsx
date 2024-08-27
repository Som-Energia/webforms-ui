import React, { useState, useEffect, useRef } from 'react'

import { useTranslation } from 'react-i18next'
import { GlobalHotKeys } from 'react-hotkeys'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'

import DisplayFormikState from '../components/DisplayFormikState'

import SendIcon from '@mui/icons-material/Send'

import VAT from './Member/VAT'
import PersonalData from './HolderChange/PersonalData'
import Payment from './Member/Payment'
import Review from './Member/Review'

import Failure from './Failure'
import Success from './Success'

import { member } from '../services/api'
import { normalizeMember } from '../services/utils'

import PrevButton from '../components/Buttons/PrevButton'
import NextButton from '../components/Buttons/NextButton'

const Member = (props) => {
  const { t, i18n } = useTranslation()
  const { language } = useParams()

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
          .matches(/(^[A-GI-Z0-9])/, t('CIF_COMMUNITY_OWNERS'))
          .matches(/^[0-9A-Z][0-9]{7}[0-9A-Z]\d*$/, t('INVALID_NIF')),
        vatvalid: Yup.bool()
          .required(t('FILL_NIF'))
          .oneOf([true], t('FILL_NIF'))
      })
    }),
    Yup.object().shape({
      member: Yup.object().shape({
        name: Yup.string().required(t('NO_NAME')),
        surname1: Yup.string().when('isphisical', {
          is: true,
          then: Yup.string().required(t('NO_SURNAME1'))
        }),
        proxyname: Yup.string().when('isphisical', {
          is: false,
          then: Yup.string().required(t('NO_PROXY_NAME'))
        }),
        proxynif: Yup.string().when('isphisical', {
          is: false,
          then: Yup.string().required(t('NO_PROXY_NIF'))
        }),
        proxynif_valid: Yup.bool().when('isphisical', {
          is: false,
          then: Yup.bool().required(t('FILL_NIF')).oneOf([true], t('FILL_NIF'))
        }),
        address: Yup.string().required(t('NO_ADDRESS')),
        postal_code: Yup.string()
          .matches(/^\d*$/, t('NO_POSTALCODE'))
          .required(t('NO_POSTALCODE'))
          .min(5, t('NO_POSTALCODE'))
          .max(5, t('NO_POSTALCODE')),
        state: Yup.object().shape({
          id: Yup.number().required(t('NO_STATE'))
        }),
        city: Yup.object().shape({
          id: Yup.number().required(t('NO_CITY'))
        }),
        email: Yup.string().required(t('NO_EMAIL')).email(t('NO_EMAIL')),
        email2: Yup.string().test(
          'repeatEmail',
          t('NO_REPEATED_EMAIL'),
          function () {
            return this.parent.email === this.parent.email2
          }
        ),
        phone1: Yup.string().min(9, t('NO_PHONE')).required(t('NO_PHONE')),
        phone2: Yup.string().min(9, t('NO_PHONE')),
        language: Yup.string().required(t('NO_LANGUAGE'))
      }),
      legal_person_accepted: Yup.bool().test({
        name: 'isTheMemberVat',
        message: t('ACCEPT_LEGAL_PERSON'),
        test: function () {
          return !(
            this.parent.member.isphisical === false &&
            this.parent.legal_person_accepted !== true
          )
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
        iban: Yup.string().when('payment_method', {
          is: 'iban',
          then: Yup.string().required(t('IBAN_ERROR'))
        }),
        iban_valid: Yup.bool().when('payment_method', {
          is: 'iban',
          then: Yup.bool()
            .required(t('IBAN_ERROR'))
            .oneOf([true], t('IBAN_ERROR'))
        }),
        sepa_accepted: Yup.bool().when('payment_method', {
          is: 'iban',
          then: Yup.bool()
            .required(t('IBAN_ERROR'))
            .oneOf([true], t('IBAN_ERROR'))
        })
      })
    }),
    Yup.object().shape({
      terms_accepted: Yup.bool()
        .required(t('UNACCEPTED_TERMS'))
        .oneOf([true], t('UNACCEPTED_TERMS'))
    })
  ]

  const MAX_STEP_NUMBER = 4
  const showProgress = false

  useEffect(() => {
    // matomo.push(['trackEvent', 'Event Category', 'Event Action', 'Event Name'])
    _paq.push([
      'trackEvent',
      'NewMember',
      'setNewMemberStep',
      `new-member-step-${activeStep}`
    ])
  }, [activeStep])

  const getActiveStep = (props) => {
    return (
      <>
        {activeStep === 0 && <VAT {...props} />}
        {activeStep === 1 && <PersonalData entity="member" {...props} />}
        {activeStep === 2 && <Payment {...props} />}
        {activeStep === 3 && <Review {...props} />}
      </>
    )
  }

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const nextStep = (props) => {
    let next = activeStep + 1
    if (
      activeStep === 4 &&
      props.values.holder.vat === props.values.member.vat &&
      props.values.holder.isphisical
    ) {
      next++
      props.setFieldValue('privacy_policy_accepted', true)
    }
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
    props.submitForm().then(() => {
      if (props.isValid) {
        props.validateForm()
        props.setTouched({})
      }
    })
  }

  const prevStep = (props) => {
    let prev = activeStep - 1
    if (
      activeStep === 6 &&
      props.values.holder.vat === props.values.member.vat &&
      props.values.holder.isphisical
    ) {
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
      vat: '',
      vatvalid: false,
      isphisical: true,
      proxynif_valid: false,
      proxynif: '',
      proxyname: '',
      name: '',
      address: '',
      number: '',
      floor: '',
      door: '',
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
    if (
      error?.data?.invalid_fields.length &&
      error?.data?.invalid_fields[0]?.field &&
      error?.data?.invalid_fields[0]?.error
    ) {
      errorCode = `${error?.data?.invalid_fields[0]?.field}_${error?.data?.invalid_fields[0].error}`
    }
    setError({ code: errorCode.toUpperCase() })
    setCompleted(true)
  }

  const trackSucces = () => {
    // matomo.push(['trackEvent', 'Event Category', 'Event Action', 'Event Name'])
    _paq.push(['trackEvent', 'NewMember', 'newMemberFormOk', 'send-new-member-ok'])
  }

  const handlePost = async (values) => {
    setSending(true)
    // matomo.push(['trackEvent', 'Event Category', 'Event Action', 'Event Name'])
    _paq.push(['trackEvent', 'Send', 'sendNewMemberClick', 'send-new-member'])
    const data = normalizeMember(values)
    await member(data)
      .then((response) => {
        if (response?.state === true) {
          setError(false)
          trackSucces()
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
      .catch((error) => {
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
          validateOnMount={true}>
          {(props) => (
            <>
              <Box>
                <Form
                  sx={{ position: 'relative' }}
                  noValidate
                  autoComplete="off">
                  {
                    <Paper
                      elevation={0}
                      id="custom_paper"
                      sx={{
                        mt: 0,
                        mb: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                      {showProgress && (
                        <LinearProgress
                          variant={sending ? 'indeterminate' : 'determinate'}
                          value={(activeStep / MAX_STEP_NUMBER) * 100}
                        />
                      )}

                      <Box mx={0} mb={3}>
                        {completed ? (
                          error ? (
                            <Failure error={error} />
                          ) : (
                            <Success
                              description={t('NEWMEMBER_OK_DESCRIPTION')}
                            />
                          )
                        ) : (
                          getActiveStep(props)
                        )}
                      </Box>
                      <Box mx={0} mt={0} mb={3}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                          {(!completed || error) && (
                            <PrevButton
                              disabled={activeStep === 0 || sending}
                              onClick={() => prevStep(props)}
                              title={t('PAS_ANTERIOR')}
                            />
                          )}
                          {activeStep < MAX_STEP_NUMBER - 1 ? (
                            <NextButton
                              data-cy="next"
                              disabled={!props.isValid}
                              onClick={() => nextStep(props)}
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
                                disabled={sending || !props.isValid}
                                onClick={() => handlePost(props.values)}>
                                {t('SEND')}
                              </Button>
                            )
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  }
                </Form>
              </Box>
              {showInspector && <DisplayFormikState {...props} />}
            </>
          )}
        </Formik>
        {data?.payment_data && (
          <form ref={formTPV} action={data.endpoint} method="POST">
            {Object.keys(data.payment_data).map((key) => (
              <input
                key={key}
                type="hidden"
                name={key}
                value={data.payment_data[key]}
              />
            ))}
          </form>
        )}
      </Container>
    </GlobalHotKeys>
  )
}

export default Member
