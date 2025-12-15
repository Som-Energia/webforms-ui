import { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import PrevButton from '../../components/NewButtons/PrevButton'
import NextButton from '../../components/NewButtons/NextButton'
import SubmitButton from '../../components/NewButtons/SubmitButton'
import SomStepper from '../../components/NewSomStepper'

import { newNormalizeMember } from '../../services/utils'
import { member } from '../../services/api'
import { NEW_MEMBER_FORM_SUBSTEPS } from '../../services/steps'
import SummaryContext from '../../context/SummaryContext'
import GurbLoadingContext from '../../context/GurbLoadingContext'
import MatomoContext from '../../trackers/matomo/MatomoProvider'
import MemberIdentifier from './pages/MemberIdentifier'
import MemberPersonalData from './pages/MemberPersonalData'
import PaymentMethod from './pages/PaymentMethod'
import MemberSummary from './pages/MemberSummary'
import Result from '../Result'

import memberIdentifierValidations from './validations/memberIdentifierValidations'
import memberPersonalDataValidations from './validations/memberPersonalDataValidations'
import memberPaymentMethodValidations from './validations/paymentMethodValidations'
import memberSummaryValidations from './validations/memberSummaryValidations'
import NewLoading from '../../components/NewLoading'

const MAX_STEP_NUMBER = 3
const NEW_MEMBER_COST = 100

const NewMemberForm = (props) => {
  const { i18n, t } = useTranslation()
  const { language } = useParams()
  const [url, setUrl] = useState('')
  const [data, setData] = useState()
  const [sending, setSending] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)
  const formTPV = useRef(null)

  const { loading } = useContext(GurbLoadingContext)
  const { summaryField, setSummaryField } = useContext(SummaryContext)
  const { trackEvent } = useContext(MatomoContext)

  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  const initialValues = {
    address: {
      street: '',
      number: '',
      floor: '',
      door: '',
      stairs: '',
      bloc: '',
      postal_code: '',
      state: { id: '', name: '' },
      city: { id: '', name: '' }
    },
    new_member: {
      nif: '',
      nif_valid: false,
      person_type: '',
      proxynif_valid: false,
      proxynif: '',
      proxyname: '',
      name: '',
      surname1: '',
      surname2: '',
      gender: '',
      birthdate: undefined,
      email: '',
      email2: '',
      phone: '',
      phone_code: '+34',
      phone_valid: false,
      language: `${i18n.language}_ES`,
      referral_source: '',
      payment_method: undefined,
      sepa_accepted: false,
      iban: undefined,
      legal_person_accepted: false
    },
    privacy_policy_accepted: false,
    statutes_accepted: false,
    comercial_info_accepted: false,
    generic_especific_conditons_accepted: false,
    urlok: t('NEWMEMBER_OK_REDIRECT_URL'),
    urlko: t('NEWMEMBER_KO_REDIRECT_URL')
  }

  const validationSchemas = [
    memberIdentifierValidations,
    memberPersonalDataValidations,
    memberPaymentMethodValidations,
    memberSummaryValidations
  ]

  useEffect(() => {
    trackEvent({
      category: 'NewMember',
      action: 'setNewMemberStep',
      name: `new-member-step-${activeStep}`
    })
  }, [activeStep])

  const nextStep = (formikProps) => {
    let next
    if (
      summaryField !== undefined &&
      activeStep !== NEW_MEMBER_FORM_SUBSTEPS['IDENTIFY_MEMBER']
    ) {
      next = MAX_STEP_NUMBER
      setSummaryField(undefined)
    } else {
      next = activeStep + 1
    }
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = (formikProps) => {
    let prev = activeStep - 1
    setActiveStep(Math.max(0, prev))
  }

  const trackSucces = () => {
    trackEvent({
      category: 'NewMember',
      action: 'newMemberFormOk',
      name: 'send-new-member-ok'
    })
  }

  const handlePost = async (values) => {
    setSending(true)
    trackEvent({
      category: 'Send',
      action: 'sendNewMemberClick',
      name: 'send-new-member'
    })

    const data = newNormalizeMember(values)
    await member(data)
      .then((response) => {
        if (response?.state === true) {
          setError(false)
          trackSucces()
          if (response?.data?.endpoint) {
            setData(response?.data)
            setUrl(response.data.endpoint)
          } else {
            setCompleted(true)
          }
        } else {
          setCompleted(true)
          setError(true)
        }
      })
      .catch((error) => {
        setCompleted(true)
        setError(true)
      })
    setSending(false)
  }

  const getStep = (props) => {
    if (activeStep === 0) {
      return <MemberIdentifier {...props} />
    } else if (activeStep === 1) {
      return <MemberPersonalData {...props} />
    } else if (activeStep === 2) {
      return <PaymentMethod {...props} />
    } else {
      return <MemberSummary {...props} />
    }
  }

  const formikRef = useRef(null)

  useEffect(() => {
    formikRef.current.validateForm()
  }, [activeStep])

  useEffect(() => {
    if (url !== '') {
      formTPV.current.submit()
    }
  }, [url])

  useEffect(() => {
    if (summaryField !== undefined) {
      setActiveStep(summaryField)
    }
  }, [summaryField])

  return (
    <Container
      maxWidth="md"
      disableGutters={true}
      sx={{
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '10px'
      }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) => {
          return (
            <>
              {sending ? (
                <NewLoading description={t('NEW_MEMBER_SUBMIT_LOADING')} />
              ) : (
                <>
                  <Box sx={{ marginBottom: '65px' }}>
                    <SomStepper
                      activeStep={activeStep}
                      steps={NEW_MEMBER_FORM_SUBSTEPS}
                    />
                  </Box>
                  {completed ? (
                    <Box sx={{ mt: 2 }}>
                      <Result
                        mode={!error ? 'success' : 'failure'}
                        title={
                          !error
                            ? t('NEW_MEMBER_SUCCESS_TITLE')
                            : t('NEW_MEMBER_ERROR_TITLE')
                        }>
                        <Typography
                          sx={{ color: 'secondary.dark' }}
                          dangerouslySetInnerHTML={{
                            __html: !error
                              ? t('NEW_MEMBER_SUCCESS_DESC')
                              : t('NEW_MEMBER_ERROR_DESC')
                          }}
                        />
                      </Result>
                    </Box>
                  ) : (
                    <>
                      {getStep(formikProps)}
                      <Grid
                        container
                        direction="row-reverse"
                        rowSpacing={2}
                        sx={{
                          marginTop: '2rem',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                        {activeStep !== 0 && (
                          <Grid item sm={2} xs={12}>
                            <PrevButton
                              disabled={sending}
                              onClick={() => prevStep(formikProps)}
                              title={'PREV'}
                            />
                          </Grid>
                        )}
                        <Grid item sm={2} xs={12} order={-1}>
                          {activeStep !== MAX_STEP_NUMBER ? (
                            <NextButton
                              disabled={
                                loading ||
                                !formikProps.isValid ||
                                activeStep === MAX_STEP_NUMBER
                              }
                              onClick={() => nextStep(formikProps)}
                              title={'NEXT'}
                            />
                          ) : (
                            <SubmitButton
                              disabled={!formikProps.isValid || completed}
                              onClick={() => handlePost(formikProps.values)}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </>
          )
        }}
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
  )
}

export default NewMemberForm
