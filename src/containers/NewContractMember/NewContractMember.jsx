import {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo
} from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'
import { Formik } from 'formik'
import MatomoContext from '../../trackers/matomo/MatomoProvider'

import Container from '@mui/material/Container'
import { Grid2 as Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import PrevButton from '../../components/Buttons/PrevButton'
import NextButton from '../../components/Buttons/NextButton'
import SubmitButton from '../../components/Buttons/SubmitButton'
import SomStepper from '../../components/SomStepper/SomStepper'
import Result from '../../containers/Result'

import {
  NEW_MEMBER_CONTRACT_FORM_SUBSTEPS,
  NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS
} from '../../services/steps'
import Stack from '../../services/Stack'
import { NextStep, keyByValue, valueByKey } from '../../services/NextStep'
import SummaryContext from '../../context/SummaryContext'
import LoadingContext from '../../context/LoadingContext'
import MemberIdentifier from '../NewMember/pages/MemberIdentifier'
import MemberPersonalData from '../NewMember/pages/MemberPersonalData'
import NewContractMemberQuestion from './pages/NewContractMemberQuestion'
import NewContractMemberSupplyPoint from './pages/NewContractMemberSupplyPoint'
import NewContractMemberSupplyPointData from './pages/NewContractMemberSupplyPointData'
import NewContractMemberPower from './pages/NewContractMemberPower'
import NewContractMemberSelfConsumptionChooser from './pages/NewContractMemberSelfConsumptionChooser'
import NewContractMemberSelfConsumptionData from './pages/NewContractMemberSelfConsumptionData'
import NewContractHolder from './pages/NewContractHolder'
import NewContractMemberVoluntaryDonation from './pages/NewContractMemberVoluntaryDonation'
import NewContractMemberPayment from './pages/NewContractMemberPayment'
import NewContractMemberSummary from './pages/NewContractMemberSummary'
import IdentifyMemberPersonalData from './pages/IdentifyMemberPersonalData'
import { NewContractMemberSignature } from './pages/NewContractMemberSignature'

import memberIdentifierValidations from '../NewMember/validations/memberIdentifierValidations'
import memberPersonalDataValidations from '../NewMember/validations/memberPersonalDataValidations'
import newContractMemberQuestionValidations from './validations/newContractMemberQuestionValidations'
import newContractMemberSupplyPointValidations from './validations/newContractMemberSupplyPointValidations'
import newContractMemberSupplyPointDataValidations from './validations/newContractMemberSupplyPointDataValidations'
import newContractMemberPowerValidations from './validations/newContractMemberPowerValidations'
import newContractMemberSelfConsumptionValidations from './validations/newContractMemberSelfConsumptionValidations'
import newContractMemberSelfConsumptionDataValidations from './validations/newContractMemberSelfConsumptionDataValidations'
import newContractHolderValidations from './validations/newContractHolderValidations'
import newContractMemberVoluntaryDonationValidations from './validations/newContractMemberVoluntaryDonationValidations'
import newContractMemberPaymentValidations from './validations/newContractMemberPaymentValidations'
import newContractMemberSummaryValidations from './validations/newContractMemberSummaryValidations'
import LinkMemberDetails from './pages/LinkMemberDetails'
import linkMemberValidations from './validations/linkMemberDetailsValidations'
import identifyMemberPersonalDataValidations from './validations/identifyMemberPersonalDataValidations'
import Loading from '../../components/Loading'
import RedirectUrl from '../Gurb/components/RedirectUrl/RedirectUrl'
import { useSyncLanguage } from '../../hooks/useTranslateOptions'
import { newNormalizeContract } from '../../services/newNormalize'
import { activateLead, createContractLead } from '../../services/api'

import { usePixelEvent } from '../../hooks/usePixelEvent'
import { isCompanyVat } from '../../services/utils'
import { buildInitialValues } from './newContractMember.values'

const ALERT_STEPS = {
  'member-off': [3, 7],
  'member-on': [2, 6],
  'member-link': [2, 6]
}

const NewContractMemberForm = (props) => {
  const { triggerEvent } = usePixelEvent()
  const [searchParams] = useSearchParams()
  const { i18n, t } = useTranslation()
  const { language } = useParams()
  const mtm_cid = searchParams.get('mtm_cid')
  const mtm_source = searchParams.get('mtm_source')
  const gurb_id = searchParams.get('gurb_id')
  const [redsysURL, setRedsysURL] = useState('')
  const [redsysData, setRedsysData] = useState()
  const formTPV = useRef(null)
  const { tariff, specialCampaign, initStep } = props

  const [hasAlert, setHasAlert] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)

  const { loading } = useContext(LoadingContext)
  const { summaryField, setSummaryField } = useContext(SummaryContext)
  const { trackEvent } = useContext(MatomoContext)
  const [sending, setSending] = useState(false)
  const [signatureCompleted, setSignatureCompleted] = useState(false)

  const [activeStep, setActiveStep] = useState(
    initStep ? parseInt(initStep) : 0
  )
  const [validationSteps, setValidationSteps] = useState([
    newContractMemberQuestionValidations
  ])
  const [formSteps, setFormSteps] = useState({})
  const [formStepsName, setFormStepsName] = useState({})
  const [MAX_STEP_NUMBER, setMAX_STEP_NUMBER] = useState(11)
  const [prevSteps] = useState(new Stack())
  const [leadId, setLeadId] = useState()

  const [gurbCode] = useState(() => searchParams.get('gurb-code'))
  const POP_UP_TIME = 180000
  const ENTERPRISE = 'enterprise'
  const DOMESTIC = 'domestic'
  const CampaignVAT = import.meta.env.VITE_CAMPAIGN_VAT
  const CampaignNumMember = import.meta.env.VITE_CAMPAIGN_MEMBER_NUMBER

  useSyncLanguage(language)

  const openPopUp = (values) => {
    const root = document.getElementById('root')
    const fnString = root.getAttribute('data-popup-function')
    if (fnString) {
      try {
        const fn = eval(fnString)
        const vat =
          values.has_member === 'member-on'
            ? values.member.nif
            : values.new_member.nif
        //TODO: check logic when change var naming
        const isCompany = vat ? isCompanyVat(vat) : null
        const param =
          isCompany === null ? '' : isCompany ? ENTERPRISE : DOMESTIC
        fn(param)
      } catch (err) {
        console.error('Error calling function from data-function (popup)', err)
      }
    }
  }

  const formikRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formikRef.current) {
        openPopUp(formikRef.current.values)
      }
    }, POP_UP_TIME)
    return () => clearTimeout(timer)
  }, [activeStep])

  const initialValues = useMemo(
    () => buildInitialValues(i18n.language, tariff),
    [i18n.language, tariff]
  )

  const validationSchemasLinkMember = [
    newContractMemberQuestionValidations,
    linkMemberValidations,
    newContractMemberSupplyPointValidations,
    newContractMemberSupplyPointDataValidations,
    newContractMemberPowerValidations,
    newContractMemberSelfConsumptionValidations,
    newContractMemberSelfConsumptionDataValidations,
    newContractHolderValidations,
    identifyMemberPersonalDataValidations,
    newContractMemberVoluntaryDonationValidations,
    newContractMemberPaymentValidations,
    newContractMemberSummaryValidations
  ]

  const validationSchemasNewMember = [
    newContractMemberQuestionValidations,
    memberIdentifierValidations,
    memberPersonalDataValidations,
    newContractMemberSupplyPointValidations,
    newContractMemberSupplyPointDataValidations,
    newContractMemberPowerValidations,
    newContractMemberSelfConsumptionValidations,
    newContractMemberSelfConsumptionDataValidations,
    newContractHolderValidations,
    newContractMemberVoluntaryDonationValidations,
    newContractMemberPaymentValidations,
    newContractMemberSummaryValidations
  ]

  const setValidationSchemaAndSteps = (has_member) => {
    if (has_member == 'member-off') {
      setValidationSteps(validationSchemasNewMember)
      setFormSteps(NEW_MEMBER_CONTRACT_FORM_SUBSTEPS)
      setFormStepsName('NEW_MEMBER_CONTRACT_FORM_SUBSTEPS')
      setMAX_STEP_NUMBER(Object.keys(NEW_MEMBER_CONTRACT_FORM_SUBSTEPS).length)
    } else if (
      has_member == 'member-on' ||
      has_member == 'member-link' ||
      has_member == 'campaign-offer'
    ) {
      setValidationSteps(validationSchemasLinkMember)
      setFormSteps(NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS)
      setFormStepsName('NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS')
      setMAX_STEP_NUMBER(
        Object.keys(NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS).length
      )
    } else {
      setValidationSteps(newContractMemberQuestionValidations)
      setFormSteps({})
      setMAX_STEP_NUMBER(11)
    }
  }

  const nextStep = (formikProps) => {
    let next
    if (summaryField !== undefined) {
      if (activeStep === formSteps['IDENTIFY_MEMBER']) {
        next = activeStep + 1
      } else {
        next = MAX_STEP_NUMBER
        setSummaryField(undefined)
      }
    } else {
      if (activeStep > 0) {
        const stepValue =
          NextStep[formStepsName][keyByValue(formSteps, activeStep)]
        next = valueByKey(formSteps, stepValue, formikProps.values)
      } else {
        next = 1
        if (formikProps.values.has_member == 'campaign-offer') {
          next = 2
        }
      }
      prevSteps.push(activeStep)
    }

    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = () => {
    let prev = prevSteps.pop()
    setCompleted(false)
    setActiveStep(Math.max(0, prev))
  }

  const trackSuccess = () => {
    trackEvent({
      category: 'NewContractMember',
      action: 'newContractMemberFormOk',
      name: 'send-new-contract-member-ok'
    })
    if (gurb_id) {
      trackEvent({
        category: 'NewContractMember',
        action: 'newContractMemberFormOk',
        name: `send-new-contract-member-ok-gurb-${gurb_id}`
      })
    }
    if (mtm_cid && mtm_source && language) {
      trackEvent({
        category: 'NewContractMember',
        action: 'newContractMemberFormOk',
        name: `success-${language.toUpperCase()}-${mtm_cid}-${mtm_source}`
      })
    }
    triggerEvent('FormularioCompletado', { status: 'ok' })
  }

  const handleCreateContract = async (values) => {
    trackEvent({
      category: 'Send',
      action: 'sendNewContractMemberClick',
      name: 'send-new-contract-member'
    })

    setSending(true)
    setSignatureCompleted(false)

    const data = newNormalizeContract(values, gurbCode)
    await createContractLead(data)
      .then((response) => {
        if (response?.state === true) {
          const { redsys_data, lead_id } = response?.data || {}
          const paymentData = redsys_data?.payment_data
          const redsysEndpoint = redsys_data?.redsys_endpoint

          if (redsysEndpoint && paymentData) {
            trackEvent({
              category: 'NewContractMemberFunnel',
              action: 'paymentCreated',
              name: 'new-contract-member-payment-created'
            })
            setRedsysData({
              redsys_endpoint: redsysEndpoint,
              payment_data: paymentData
            })
            setRedsysURL(redsysEndpoint)
            trackSuccess()
            setCompleted(true)
            setError(false)
          } else if (lead_id && formSteps['SIGNATURE']) {
            setLeadId(lead_id)
            nextStep({ values })
            setError(false)
          } else {
            setCompleted(true)
            setError(true)
          }
        } else {
          setCompleted(true)
          setError(true)
        }
        })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => {
        setSending(false)
      })
  }

  useEffect(() => {
    const has_member = formikRef.current?.values?.has_member
    const alertSteps = ALERT_STEPS[has_member] ?? []
    setHasAlert(alertSteps.includes(activeStep))
  }, [activeStep])

  const handleSignatureSuccess = () => {
    if (!signatureCompleted) {
      return
    }

    if (!leadId) {
      setError(true)
      setCompleted(true)
      return
    }

    setSending(true)
    activateLead(leadId)
      .then(() => {
        trackSuccess()
        setError(false)
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => {
        setCompleted(true)
        setSending(false)
      })
  }

  const handleSignatureCompleted = () => {
    trackEvent({
      category: 'NewContractMemberFunnel',
      action: 'signatureCompleted',
      name: 'new-contract-member-signature-completed'
    })
    setSignatureCompleted(true)
  }

  const getStep = (props, sendTrackEvent) => {
    const { values } = props

    const trackProps = { ...props, sendTrackEvent }

    if (values?.has_member == 'member-off') {
      if (activeStep === 1) {
        return <MemberIdentifier {...props} />
      } else if (activeStep === 2) {
        return <MemberPersonalData {...props} />
      } else if (activeStep === 3) {
        return <NewContractMemberSupplyPoint {...trackProps} />
      } else if (activeStep === 4) {
        return <NewContractMemberSupplyPointData {...trackProps} />
      } else if (activeStep === 5) {
        return <NewContractMemberPower {...trackProps} />
      } else if (activeStep === 6) {
        return <NewContractMemberSelfConsumptionChooser {...trackProps} />
      } else if (activeStep === 7) {
        return <NewContractMemberSelfConsumptionData {...props} />
      } else if (activeStep === 8) {
        return <NewContractHolder {...props} />
      } else if (activeStep === 9) {
        return <NewContractMemberVoluntaryDonation {...trackProps} />
      } else if (activeStep === 10) {
        return <NewContractMemberPayment {...trackProps} />
      } else if (activeStep === 11) {
        return <NewContractMemberSummary {...trackProps} />
      } else if (activeStep === 12) {
        return (
          <NewContractMemberSignature
            {...props}
            leadId={leadId}
            cups={values?.cups}
            onSuccess={handleSignatureCompleted}
          />
        )
      }
    } else {
      if (activeStep === 1) {
        return <LinkMemberDetails {...props} />
      } else if (activeStep === 2) {
        return <NewContractMemberSupplyPoint {...trackProps} />
      } else if (activeStep === 3) {
        return <NewContractMemberSupplyPointData {...trackProps} />
      } else if (activeStep === 4) {
        return <NewContractMemberPower {...trackProps} />
      } else if (activeStep === 5) {
        return <NewContractMemberSelfConsumptionChooser {...trackProps} />
      } else if (activeStep === 6) {
        return <NewContractMemberSelfConsumptionData {...props} />
      } else if (activeStep === 7) {
        return <NewContractHolder {...props} />
      } else if (activeStep === 8) {
        return <IdentifyMemberPersonalData {...props} holder={true} />
      } else if (activeStep === 9) {
        return <NewContractMemberVoluntaryDonation {...trackProps} />
      } else if (activeStep === 10) {
        return <NewContractMemberPayment {...trackProps} />
      } else if (activeStep === 11) {
        return <NewContractMemberSummary {...trackProps} />
      } else if (activeStep === 12) {
        return (
          <NewContractMemberSignature
            {...props}
            leadId={leadId}
            cups={values?.cups}
            onSuccess={handleSignatureCompleted}
          />
        )
      }
    }
  }

  useEffect(() => {
    formikRef.current.validateForm()
  }, [activeStep])

  useEffect(() => {
    if (completed && redsysURL !== '') {
      formTPV.current.submit()
    }
  }, [completed])

  useEffect(() => {
    if (summaryField !== undefined) {
      setActiveStep(summaryField)
    }
  }, [summaryField])

  useEffect(() => {
    trackEvent({
      category: 'NewContractMember',
      action: 'setNewContractMemberStep',
      name: `new-contract-member-step-${activeStep}`
    })
  }, [activeStep])

  const sendTrackEvent = (id) => {
    trackEvent({
      category: 'NewContractMember',
      action: 'setNewContractMemberStep',
      name: `new-contract-member-step-${id}`
    })
  }

  const sendTrackInitEvent = useCallback(
    (id) => {
      const track_id = gurb_id ? `${id}-gurb-${gurb_id}` : id
      trackEvent({
        category: 'NewContractMember',
        action: 'setNewContractMemberStep',
        name: `new-contract-member-step-${track_id}`
      })
    },
    [gurb_id]
  )

  const customInitialValues = useMemo(() => {
    if (specialCampaign === '15YEARS_CAMPAIGN') {
      return {
        ...initialValues,
        has_member: 'campaign-offer',
        member: {
          number: CampaignNumMember,
          nif: CampaignVAT
        }
      }
    }
    return initialValues
  }, [initialValues, specialCampaign])

  if (
    Object.keys(formSteps).length === 0 &&
    specialCampaign === '15YEARS_CAMPAIGN'
  ) {
    setValidationSchemaAndSteps('campaign-offer')
  }

  return (
    <Container
      data-cy="contract-form"
      aria-label="contract-form"
      maxWidth="md"
      disableGutters={true}
      sx={{
        padding: '2rem',
        backgroundColor: 'secondary.white',
        borderRadius: '10px'
      }}>
      <Formik
        innerRef={formikRef}
        initialValues={customInitialValues}
        validationSchema={validationSteps[activeStep]}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) =>
          sending ? (
            <Loading description={t('NEW_CONTRACT_SUBMIT_LOADING')} />
          ) : (
            <>
              {activeStep === 0 ? (
                <NewContractMemberQuestion
                  formikProps={formikProps}
                  sendTrackEvent={sendTrackInitEvent}
                  nextStep={nextStep}
                  setValidationSchemaAndSteps={setValidationSchemaAndSteps}
                />
              ) : (
                <>
                  {!completed && (
                    <Box sx={{ marginBottom: hasAlert ? '25px' : '65px' }}>
                      <SomStepper
                        activeStep={activeStep - 1} // because step 0 does not count
                        steps={formSteps}
                      />
                    </Box>
                  )}

                  {!completed && getStep(formikProps, sendTrackEvent)}

                  {!completed && (
                    <Grid
                      container
                      direction="row-reverse"
                      rowSpacing={2}
                      sx={{
                        marginTop: '2rem',
                        justifyContent: redsysURL ? 'center' : 'space-between',
                        alignItems: 'center'
                      }}>
                      {activeStep !== initStep && (
                        <Grid item size={{ sm: 2, xs: 12 }}>
                          <PrevButton
                            disabled={summaryField !== undefined}
                            onClick={() => prevStep()}>
                            {t('PREV')}
                          </PrevButton>
                        </Grid>
                      )}
                      <Grid item size={{ sm: 2, xs: 12 }} order={-1}>
                        {activeStep === formSteps['SUMMARY'] ? (
                          <SubmitButton
                            disabled={loading || !formikProps.isValid}
                            onClick={() => handleCreateContract(formikProps.values)}>
                            {t('NEXT')}
                          </SubmitButton>
                        ) : activeStep === formSteps['SIGNATURE'] ? (
                          <SubmitButton
                            disabled={loading || !signatureCompleted}
                            onClick={() => handleSignatureSuccess()}>
                            {gurbCode ? t('GURB_NEXT_PAYMENT') : t('FINISH')}
                          </SubmitButton>
                        ) : (
                          <NextButton
                            disabled={
                              loading ||
                              !formikProps.isValid ||
                              activeStep === MAX_STEP_NUMBER
                            }
                            onClick={() => nextStep(formikProps)}>
                            {t('NEXT')}
                          </NextButton>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {completed && (
                    <Box sx={{ mt: 2 }}>
                      {gurbCode && !error && (
                        <RedirectUrl
                          title={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_TITLE')}
                          description={t(
                            'GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_DESCRIPTION'
                          )}
                          url={t(
                            'GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_BUTTON_URL',
                            { gurbCode, language: i18n.language }
                          )}
                          buttonText={t(
                            'GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_BUTTON_TEXT'
                          )}
                        />
                      )}

                      {!gurbCode && (
                        <Result
                          mode={!error ? 'success' : 'failure'}
                          title={
                            !error
                              ? t('NEW_MEMBER_CONTRACT_SUCCESS_TITLE')
                              : t('NEW_MEMBER_CONTRACT_ERROR_TITLE')
                          }>
                          <Typography
                            sx={{
                              color: 'secondary.extraDark',
                              textAlign: 'center'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: !error
                                ? formikProps.values.has_member == 'member-off'
                                  ? t('NEW_MEMBER_CONTRACT_SUCCESS_DESC')
                                  : t('NEW_CONTRACT_SUCCESS_DESC')
                                : t('NEW_MEMBER_CONTRACT_ERROR_DESC')
                            }}
                          />
                        </Result>
                      )}
                    </Box>
                  )}
                </>
              )}
            </>
          )
        }
      </Formik>

      {redsysData && redsysData.redsys_endpoint && redsysData.payment_data && (
        <form ref={formTPV} action={redsysData.redsys_endpoint} method="POST">
          {Object.keys(redsysData.payment_data).map((key) => (
            <input
              key={key}
              type="hidden"
              name={key}
              value={redsysData.payment_data[key]}
            />
          ))}
        </form>
      )}
    </Container>
  )
}

export default NewContractMemberForm
