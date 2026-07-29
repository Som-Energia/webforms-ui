import { useState, useEffect, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'
import MatomoContext from '../../trackers/matomo/MatomoProvider'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import supplyPointValidations from './validations/supplyPointValidations'
import {
  addressValidations,
  lightValidations
} from './validations/requirementsValidations'

import LoadingContext from '../../context/LoadingContext'

// Step components
import NewSomStepper from '../../components/NewSomStepper/NewSomStepper'
import SupplyPoint from './pages/Requirements/SupplyPoint'
import LightQuestion from './pages/Requirements/LightQuestion'
import Address from './pages/Requirements/Address'
import GurbRequirementsTariffSelection from './pages/Requirements/GurbRequirementsTariffSelection'
import GurbRequirementsResult from './pages/Requirements/GurbRequirementsResult'
import { useSyncLanguage } from '../../hooks/useTranslateOptions'
import { GURB_REQUIREMENTS_FORM_SUBSTEPS } from '../../services/steps'

const GurbFormRequirements = () => {
  const { language, gurbCode } = useParams()
  const { loading } = useContext(LoadingContext)
  const { trackEvent } = useContext(MatomoContext)

  const [activeStep, setActiveStep] = useState(0)

  const defaultSteps = [
    (formikProps) => (
      <SupplyPoint
        {...formikProps}
        activeStep={activeStep}
      />
    ),
    (formikProps) => <Address {...formikProps} activeStep={activeStep} />,
    (formikProps) => <LightQuestion {...formikProps} activeStep={activeStep} />
  ]

  const [steps, setSteps] = useState(defaultSteps)
  const newContractSteps = [
    ...defaultSteps,
    (formikProps) => <GurbRequirementsTariffSelection {...formikProps} />
  ]

  const initialValues = {
    cups: '',
    has_light: undefined,
    address: {
      id: '',
      street: '',
      number: undefined,
      postal_code: undefined,
      lat: undefined,
      long: undefined,
      inside_perimeter: false
    },
    new_contract: undefined,
    redirectUrl: undefined
  }

  const validationSchemas = [
    supplyPointValidations,
    addressValidations,
    lightValidations
  ]

  const formikRef = useRef(null)

  useEffect(() => {
    formikRef.current?.validateForm()
    const { values } = formikRef.current

    // new contract
    if (
      activeStep === GURB_REQUIREMENTS_FORM_SUBSTEPS.ADDRESS &&
      values.new_contract
    ) {
      setSteps(newContractSteps)
    }
  }, [activeStep])

  useSyncLanguage(language)

  useEffect(() => {
    if (activeStep !== steps.length) {
      trackEvent({
        category: 'GurbRequirements',
        action: 'setGurbRequirementsStep',
        name: `gurb-requirements-step-${activeStep}-${gurbCode}`
      })
    }
  }, [activeStep, gurbCode, steps.length])

  const renderCurrentStep = (formikProps) => {
    return steps.at(activeStep)?.(formikProps)
  }

  const isInvalidStep = (formik) => {
    if (!formik?.isValid) {
      return true
    }

    const { address, has_light, redirectUrl } = formik.values || {}

    return (
      (activeStep === GURB_REQUIREMENTS_FORM_SUBSTEPS.ADDRESS &&
        !address.inside_perimeter) ||
      (activeStep === GURB_REQUIREMENTS_FORM_SUBSTEPS.LIGHT &&
        has_light !== 'light-on') ||
      (activeStep === GURB_REQUIREMENTS_FORM_SUBSTEPS.TARIFF_SELECTION &&
        !redirectUrl)
    )
  }

  return (
    <Container
      data-cy="gurb-requirements-form"
      aria-label="gurb-requirements-form"
      maxWidth="md"
      disableGutters
      sx={{ padding: '1rem' }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        validateOnChange
        validateOnBlur={false}>
        {(formikProps) => {
          return (
            <>
              {activeStep < steps.length && (
                <Box sx={{ marginBottom: '65px' }}>
                  <NewSomStepper
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    steps={steps}
                    disableNext={loading || isInvalidStep(formikProps)}
                    showStepTitle={true}>
                    {renderCurrentStep(formikProps)}
                  </NewSomStepper>
                </Box>
              )}

              {activeStep === steps.length && (
                <Box sx={{ mt: 2 }}>
                  <GurbRequirementsResult
                    {...formikProps}
                    gurbCode={gurbCode}
                  />
                </Box>
              )}
            </>
          )
        }}
      </Formik>
    </Container>
  )
}

export default GurbFormRequirements
