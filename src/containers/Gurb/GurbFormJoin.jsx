import {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback
} from 'react'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'
import MatomoContext from '../../trackers/matomo/MatomoProvider'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import SubmitButton from '../../components/Buttons/SubmitButton'
import NewSomStepper from '../../components/NewSomStepper/NewSomStepper'

import {
  identifierValidations,
  gurbPowerOptions,
  gurbPolicyChecks
} from './validations/GurbValidations'

import LoadingContext from '../../context/LoadingContext'

// Step components
import GurbIdentification from './pages/Gurb/GurbIdentification'
import GurbParticipation from './pages/Gurb/GurbParticipation'
import ContractReview from './pages/Gurb/ContractReview'
import GurbSignature from './pages/Gurb/GurbSignature'
import { useSyncLanguage } from '../../hooks/useTranslateOptions'
import { useTranslation } from 'react-i18next'

const GurbFormJoin = () => {
  const { language, code } = useParams()
  const { t } = useTranslation()

  const [redsysData, setRedsysData] = useState()
  const [validSignature, setValidSignature] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [submitAction, setSubmitAction] = useState(false)

  const { loading } = useContext(LoadingContext)

  const { trackEvent } = useContext(MatomoContext)

  useSyncLanguage(language)

  const formikRef = useRef(null)
  useEffect(() => {
    formikRef.current.validateForm()
  }, [activeStep])

  const handleFormRef = useCallback((ref) => {
    if (ref) {
      ref.submit()
    }
  }, [])

  const initialValues = useMemo(
    () => ({
      new_contract: undefined,
      tariff_name: '',
      owner: {
        nif: '',
        nif_valid: false
      },
      cups: '',
      gurb: {
        power: '',
        daily_cost: '',
        join_cost: '',
        surplus_compensation: ''
      },
      privacy_policy_accepted: false,
      generic_especific_conditons_accepted: false,
      gurb_adhesion_payment_accepted: false,
      payment_data: undefined
    }),
    []
  )

  const validationSchemas = useMemo(
    () => [identifierValidations, gurbPowerOptions, gurbPolicyChecks],
    []
  )

  const steps = [
    (formikProps) => <GurbIdentification {...formikProps} />,
    (formikProps) => <GurbParticipation {...formikProps} gurbCode={code} />,
    (formikProps) => (
      <ContractReview {...formikProps} activeStep={activeStep} />
    ),
    (formikProps) => (
      <GurbSignature
        {...formikProps}
        gurbCode={code}
        setRedsysData={setRedsysData}
        onSuccess={() => setValidSignature(true)}
      />
    )
  ]

  const renderCurrentStep = (formikProps) => {
    return steps.at(activeStep)?.(formikProps) ?? null
  }

  const handleSubmit = () => {
    setSubmitAction(true)
    trackEvent({
      category: 'GurbFormJoin',
      action: 'setGurbFormJoinStep',
      name: `gurb-join-signed-${code}`
    })
  }

  useEffect(() => {
    trackEvent({
      category: 'GurbFormJoin',
      action: 'setGurbFormJoinStep',
      name: `gurb-join-step-${activeStep}-${code}`
    })
  }, [activeStep, code])

  return (
    <Container
      data-cy="gurb-join-form"
      aria-label="gurb-join-form"
      maxWidth="md"
      disableGutters
      sx={{ padding: '1rem' }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        validateOnChange
        validateOnBlur={false}>
        {(formikProps) => (
          <>
            <Box sx={{ marginBottom: '65px' }}>
              <NewSomStepper
                showStepTitle={true}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                disableNext={loading || !formikProps.isValid}
                steps={steps}
                nextButton={
                  activeStep === steps.length - 1 && (
                    <SubmitButton
                      disabled={
                        loading || !formikProps.isValid || !validSignature
                      }
                      onClick={() => handleSubmit()}>
                      {t('GURB_NEXT_PAYMENT')}
                    </SubmitButton>
                  )
                }>
                {renderCurrentStep(formikProps)}
              </NewSomStepper>
            </Box>
          </>
        )}
      </Formik>

      {redsysData && validSignature && submitAction && (
        <form
          ref={handleFormRef}
          action={redsysData.redsys_endpoint}
          method="POST">
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

export default GurbFormJoin
