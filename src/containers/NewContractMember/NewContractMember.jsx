import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'
import { Formik } from 'formik'
import MatomoContext from '../../trackers/matomo/MatomoProvider'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import PrevButton from '../../components/NewButtons/PrevButton'
import NextButton from '../../components/NewButtons/NextButton'
import SubmitButton from '../../components/NewButtons/SubmitButton'
import SomStepper from '../../components/NewSomStepper'
import Result from '../../containers/Result'

import {
  NEW_MEMBER_CONTRACT_FORM_SUBSTEPS,
  NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS
} from '../../services/steps'
import SummaryContext from '../../context/SummaryContext'
import GurbLoadingContext from '../../context/GurbLoadingContext'
import MemberIdentifier from '../NewMember/MemberIdentifier'
import MemberPersonalData from '../NewMember/MemberPersonalData'
import NewContractMemberQuestion from './NewContractMemberQuestion'
import NewContractMemberSupplyPoint from './NewContractMemberSupplyPoint'
import NewContractMemberSupplyPointData from './NewContractMemberSupplyPointData'
import NewContractMemberPower from './NewContractMemberPower'
import NewContractMemberSelfConsumptionChooser from './NewContractMemberSelfConsumptionChooser'
import NewContractMemberSelfConsumptionData from './NewContractMemberSelfConsumptionData'
import NewContractMemberHolder from './NewContractMemberHolder'
import NewContractHolder from './NewContractHolder'
import NewContractMemberVoluntaryDonation from './NewContractMemberVoluntaryDonation'
import NewContractMemberPayment from './NewContractMemberPayment'
import NewContractMemberSummary from './NewContractMemberSummary'
import IdentifyMemberPersonalData from './IdentifyMemberPersonalData'

import memberIdentifierValidations from '../NewMember/memberIdentifierValidations'
import memberPersonalDataValidations from '../NewMember/memberPersonalDataValidations'
import newContractMemberQuestionValidations from './newContractMemberQuestionValidations'
import newContractMemberSupplyPointValidations from './newContractMemberSupplyPointValidations'
import newContractMemberSupplyPointDataValidations from './newContractMemberSupplyPointDataValidations'
import newContractMemberPowerValidations from './newContractMemberPowerValidations'
import newContractMemberSelfConsumptionValidations from './newContractMemberSelfConsumptionValidations'
import newContractMemberSelfConsumptionDataValidations from './newContractMemberSelfConsumptionDataValidations'
import newContractMemberHolderValidations from './newContractMemberHolderValidations'
import newContractHolderValidations from './newContractHolderValidations'
import newContractMemberVoluntaryDonationValidations from './newContractMemberVoluntaryDonationValidations'
import newContractMemberPaymentValidations from './newContractMemberPaymentValidations'
import newContractMemberSummaryValidations from './newContractMemberSummaryValidations'
import ApadrinatingDetails from '../Gurb/pages/NewMember/ApadrinatingDetails'
import linkMemberValidations from '../Gurb/pages/NewMember/linkMemberDetailsValidations'
import identifyMemberPersonalDataValidations from './identifyMemberPersonalDataValidations'
import NewLoading from '../../components/NewLoading'
import RedirectUrl from '../Gurb/components/RedirectUrl'

import { newNormalizeContract } from '../../services/newNormalize'
import { newContract } from '../../services/api'

import { usePixelEvent } from "../../hooks/usePixelEvent"

const NewContractMemberForm = (props) => {

  const { triggerEvent } = usePixelEvent()
  const [searchParams] = useSearchParams()
  const { i18n, t } = useTranslation()
  const { language } = useParams()
  const mtm_cid = searchParams.get("mtm_cid")
  const mtm_source = searchParams.get("mtm_source")
  const gurb_id = searchParams.get("gurb_id")
  const [url, setUrl] = useState('')
  const [data, setData] = useState()
  const formTPV = useRef(null)
  const { tariff } = props

  const [hasAlert, setHasAlert] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(false)

  const { loading } = useContext(GurbLoadingContext)
  const { summaryField, setSummaryField } = useContext(SummaryContext)
  const { trackEvent } = useContext(MatomoContext)
  const [sending, setSending] = useState(false)

  const [activeStep, setActiveStep] = useState(0)
  const [validationSteps, setValidationSteps] = useState([
    newContractMemberQuestionValidations
  ])
  const [formSteps, setFormSteps] = useState({})
  const [MAX_STEP_NUMBER, setMAX_STEP_NUMBER] = useState(11)

  const [gurbCode] = useState(() => searchParams.get("gurb-code"));


  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  const initialValues = {
    cups: '',
    has_member: undefined,
    member_is_holder: undefined,
    has_light: undefined,
    previous_holder: undefined,
    voluntary_donation: undefined,
    cadastral_reference: undefined,
    cadastral_reference_valid: true,
    supply_point: {
      cnae: '',
      supply_point_accepted: false,
      is_housing: '',
      attachments: []
    },
    supply_point_address: {
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
    member: {
      number: '',
      nif: ''
    },
    new_member: {
      nif: '',
      nif_valid: false,
      person_type: '',
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
    contract: {
      tariff_mode: tariff,
      power_type: '',
      power: {
        power1: '',
        power2: '',
        power3: '',
        power4: '',
        power5: '',
        power6: ''
      },
      phase: 'mono'
    },
    has_selfconsumption: undefined,
    self_consumption: {
      cau: '',
      cau_valid: false,
      collective_installation: undefined,
      installation_type: '',
      technology: 'b11',
      aux_services: undefined,
      installation_power: ''
    },
    privacy_policy_accepted: false,
    generic_conditions_accepted: false,
    statutes_accepted: false,
    comercial_info_accepted: false
  }

  const validationSchemasLinkMember = [
    newContractMemberQuestionValidations,
    linkMemberValidations,
    newContractMemberSupplyPointValidations,
    newContractMemberSupplyPointDataValidations,
    newContractMemberPowerValidations,
    newContractMemberSelfConsumptionValidations,
    newContractMemberSelfConsumptionDataValidations,
    newContractHolderValidations,
    newContractMemberHolderValidations,
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
    newContractMemberHolderValidations,
    newContractMemberVoluntaryDonationValidations,
    newContractMemberPaymentValidations,
    newContractMemberSummaryValidations
  ]

  const setValidationSchemaAndSteps = (has_member) => {
    if (has_member == 'member-off') {
      setValidationSteps(validationSchemasNewMember)
      setFormSteps(NEW_MEMBER_CONTRACT_FORM_SUBSTEPS)
      setMAX_STEP_NUMBER(Object.keys(NEW_MEMBER_CONTRACT_FORM_SUBSTEPS).length)
    } else if (has_member == 'member-on') {
      setValidationSteps(validationSchemasLinkMember)
      setFormSteps(NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS)
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
    if (
      summaryField !== undefined &&
      activeStep !== formSteps['IDENTIFY_MEMBER']
    ) {
      next = MAX_STEP_NUMBER
      setSummaryField(undefined)
    } else {
      next = activeStep + 1
    }

    if (
      activeStep === formSteps['POWER'] &&
      formikProps.values.has_light === 'light-off' &&
      formikProps.values.has_member === 'member-on'
    ) {
      next = next + 2
    }

    if (
      activeStep === formSteps['POWER'] &&
      formikProps.values.has_light === 'light-off' &&
      formikProps.values.has_member === 'member-off'
    ) {
      next = next + 3
    }

    if (
      activeStep === formSteps['SELFCONSUMPTION'] &&
      formikProps.values.has_selfconsumption === 'selfconsumption-off'
    ) {
      next = next + 1
    }

    if (
      activeStep === formSteps['HOLDER_MEMBER_INFO'] &&
      formikProps.values.member_is_holder === 'holder-member-yes'
    ) {
      next = next + 1
    }

    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = (formikProps) => {
    let prev = activeStep - 1

    if (
      activeStep === formSteps['HOLDER_MEMBER_INFO'] &&
      formikProps.values.has_light === 'light-on' &&
      formikProps.values.has_selfconsumption === 'selfconsumption-off'
    ) {
      prev = prev - 1
    }

    if (
      activeStep === formSteps['HOLDER_MEMBER_INFO'] &&
      formikProps.values.has_light === 'light-off' &&
      formikProps.values.has_member === 'member-on'
    ) {
      prev = prev - 2
    }

    if (
      activeStep === formSteps['DONATION'] &&
      formikProps.values.has_light === 'light-off' &&
      formikProps.values.has_member === 'member-off'
    ) {
      prev = prev - 3
    }

    if (
      activeStep === formSteps['DONATION'] &&
      formikProps.values.member_is_holder === 'holder-member-yes'
    ) {
      prev = prev - 1
    }

    setActiveStep(Math.max(0, prev))
  }

  const trackSucces = () => {

    trackEvent({ category: 'NewContractMember', action: 'newContractMemberFormOk', name: 'send-new-contract-member-ok' })
    if (gurb_id) {
      trackEvent({ category: 'NewContractMember', action: 'newContractMemberFormOk', name: `send-new-contract-member-ok-gurb-${gurb_id}` })
    }
    if (mtm_cid && mtm_source && language) {
      trackEvent({ category: 'NewContractMember', action: 'newContractMemberFormOk', name: `success-${language.toUpperCase()}-${mtm_cid}-${mtm_source}` })
    }
    triggerEvent("FormularioCompletado", { status: "ok" })
  }

  const handlePost = async (values) => {
    trackEvent({ category: 'Send', action: 'sendNewContractMemberClick', name: 'send-new-contract-member' })
    setSending(true)
    const data = newNormalizeContract(values, gurbCode)
    await newContract(data)
      .then((response) => {
        if (response?.state === true) {
          trackSucces()
          if (response?.data?.redsys_endpoint) {
            setData(response?.data)
            setUrl(response.data.redsys_endpoint)
          } else {
            setCompleted(true)
            setError(false)
          }
        } else {
          setCompleted(true)
          setError(true)
        }
      })
      .catch((error) => {
        setCompleted(true)
        setError(true)
        console.error(error)
      })
      .finally(() => {
        setSending(false)
      })
  }

  const getStep = (props, sendTrackEvent) => {
    const { values } = props

    const trackProps = { ...props, sendTrackEvent }

    if (values?.has_member == 'member-off') {

      if (activeStep === 1) {
        return <MemberIdentifier {...props} />
      } else if (activeStep === 2) {
        setHasAlert(false)
        return <MemberPersonalData {...props} />
      } else if (activeStep === 3) {
        setHasAlert(true)
        return <NewContractMemberSupplyPoint {...trackProps} />
      } else if (activeStep === 4) {
        setHasAlert(false)
        return <NewContractMemberSupplyPointData {...trackProps} />
      } else if (activeStep === 5) {
        return <NewContractMemberPower {...trackProps} />
      } else if (activeStep === 6) {
        setHasAlert(false)
        return <NewContractMemberSelfConsumptionChooser {...trackProps} />
      } else if (activeStep === 7) {
        setHasAlert(true)
        return <NewContractMemberSelfConsumptionData {...props} />
      } else if (activeStep === 8) {
        setHasAlert(false)
        return <NewContractMemberHolder {...props} />
      } else if (activeStep === 9) {
        return <NewContractMemberVoluntaryDonation {...trackProps} />
      } else if (activeStep === 10) {
        return <NewContractMemberPayment {...trackProps} />
      } else {
        return <NewContractMemberSummary {...trackProps} />
      }
    } else {

      if (activeStep === 1) {
        setHasAlert(false)
        return <ApadrinatingDetails {...props} />
      } else if (activeStep === 2) {
        setHasAlert(true)
        return <NewContractMemberSupplyPoint {...trackProps} />
      } else if (activeStep === 3) {
        setHasAlert(false)
        return <NewContractMemberSupplyPointData {...trackProps} />
      } else if (activeStep === 4) {
        return <NewContractMemberPower {...trackProps} />
      } else if (activeStep === 5) {
        setHasAlert(false)
        return <NewContractMemberSelfConsumptionChooser {...trackProps} />
      } else if (activeStep === 6) {
        setHasAlert(true)
        return <NewContractMemberSelfConsumptionData {...props} />
      } else if (activeStep === 7) {
        setHasAlert(false)
        return <NewContractHolder {...props} />
      } else if (activeStep === 8) {
        return <NewContractMemberHolder {...props} />
      } else if (activeStep === 9) {
        return <IdentifyMemberPersonalData {...props} holder={true} />
      } else if (activeStep === 10) {
        return <NewContractMemberVoluntaryDonation {...trackProps} />
      } else if (activeStep === 11) {
        return <NewContractMemberPayment {...trackProps} />
      } else {
        return <NewContractMemberSummary {...trackProps} />
      }
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

  const sendTrackInitEvent = useCallback((id) => {
    const track_id = gurb_id ? `${id}-gurb-${gurb_id}` : id
    trackEvent({
      category: 'NewContractMember',
      action: 'setNewContractMemberStep',
      name: `new-contract-member-step-${track_id}`
    })
  },[gurb_id])


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
        validationSchema={validationSteps[activeStep]}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) => {
          return sending ? (
            <NewLoading description={t('NEW_CONTRACT_SUBMIT_LOADING')} />
          ) : (
            <>
              {activeStep == 0 ? (
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
                  {completed ? (
                    <Box sx={{ mt: 2 }}>

                      {gurbCode && !error ? (
                        <RedirectUrl
                          title={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_TITLE')}
                          description={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_DESCRIPTION')}
                          url={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_BUTTON_URL', { gurbCode, language: i18n.language })}
                          buttonText={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_BUTTON_TEXT')}
                        />
                      ) : (
                        <Result
                          mode={!error ? 'success' : 'failure'}
                          title={
                            !error
                              ? t('NEW_MEMBER_CONTRACT_SUCCESS_TITLE')
                              : t('NEW_MEMBER_CONTRACT_ERROR_TITLE')
                          }
                        >
                          <Typography
                            sx={{ color: 'secondary.extraDark', textAlign: 'center' }}
                            dangerouslySetInnerHTML={{
                              __html: !error
                                ? formikProps.values.has_member === 'member-on'
                                  ? t('NEW_CONTRACT_SUCCESS_DESC')
                                  : t('NEW_MEMBER_CONTRACT_SUCCESS_DESC')
                                : t('NEW_MEMBER_CONTRACT_ERROR_DESC'),
                            }}
                          />
                        </Result>
                      )}

                    </Box>
                  ) : (
                    getStep(formikProps, sendTrackEvent)
                  )}
                  {!completed && (
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
                            disabled={!formikProps.isValid}
                            onClick={() => handlePost(formikProps.values)}
                          />
                        )}
                      </Grid>
                    </Grid>
                  )}
                </>
              )
              }
            </>
          )
        }}
      </Formik>
      {
        data?.payment_data && (
          <form ref={formTPV} action={data.redsys_endpoint} method="POST">
            {Object.keys(data.payment_data).map((key) => (
              <input
                key={key}
                type="hidden"
                name={key}
                value={data.payment_data[key]}
              />
            ))}
          </form>
        )
      }
    </Container >
  )
}

export default NewContractMemberForm
