import React, { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import PrevButton from '../components/NewButtons/PrevButton'
import NextButton from '../components/NewButtons/NextButton'

import supplyPointValidations from './Gurb/supplyPointValidations'
import {
  addressValidations,
  lightValidations,
  selfConsumptionValidations,
} from './Gurb/requirementsValidations'

import GurbErrorContext from '../context/GurbErrorContext'
import GurbLoadingContext from '../context/GurbLoadingContext'

import { GURB_REQUIREMENTS_SUBSTEPS } from '../services/steps'
import useCheckMobileScreen from '../services/checkMobileScreen'

// Step components
import SupplyPoint from './Gurb/SupplyPoint'
import LightQuestion from './Gurb/pages/Requirements/LightQuestion'
import Address from './Gurb/pages/Requirements/Address'
import SelfConsumption from './Gurb/pages/Requirements/SelfConsumption'
import SomStepper from '../components/NewSomStepper'
import GurbRequirementsFinishWithoutContract from './Gurb/pages/Gurb/GurbRequirementsWithoutContractTariffSelection'
import GurbRequirementsResult from './Gurb/pages/Gurb/GurbRequirementsResult'

const MAX_STEP_NUMBER = 5

const GurbFormRequirements = () => {
  const { i18n } = useTranslation()
  const { language } = useParams()
  const { loading } = useContext(GurbLoadingContext)
  const [activeStep, setActiveStep] = useState(1)
  const [completed, setCompleted] = useState(false)
  const isMobile = useCheckMobileScreen()
  const { setError, setErrorInfo } = useContext(GurbErrorContext)

  const initialValues = {
    is_client: undefined,
    already_contract: false,
    cups: '',
    has_light: undefined,
    address: {
      id: '',
      street: '',
      number: undefined,
      postal_code: undefined,
      state: { id: '', name: '' },
      city: { id: '', name: '' },
      lat: undefined,
      long: undefined,
      inside_perimeter: false,
    },
    has_selfconsumption: undefined,
    has_member: undefined,
    redirectUrl: undefined,
  }

  const validationSchemas = [
    supplyPointValidations,
    addressValidations,
    lightValidations,
    selfConsumptionValidations,
  ]

  const formikRef = useRef(null)

  useEffect(() => {
    formikRef.current?.validateForm()
  }, [activeStep])

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const nextStep = (formikProps) => {
    const { values } = formikProps

    if (activeStep === 4) {
      setCompleted(true)
    }
    if (activeStep === 3 && values.already_contract === true) {
      setCompleted(true)
    }

    setActiveStep((prev) => {
      if (prev === 3 && values.already_contract === true) {
        return MAX_STEP_NUMBER
      }
      return Math.min(prev + 1, MAX_STEP_NUMBER)
    })
  }

  const prevStep = () => {
    setActiveStep((prev) => Math.max(1, prev - 1))
  }

  const getStep = (formikProps) => {
    const { values } = formikProps

    switch (activeStep) {
      case 1:
        return <SupplyPoint {...formikProps} activeStep={activeStep} />
      case 2:
        return <Address {...formikProps} activeStep={activeStep} />
      case 3:
        return <LightQuestion {...formikProps} activeStep={activeStep} />
      case 4:
        return <SelfConsumption {...formikProps} activeStep={activeStep} />
      case 5:
        if (values.new_contract !== false) {
          return <GurbRequirementsFinishWithoutContract {...formikProps} />
        }
        return null
      default:
        return null
    }
  }

  return (
    <Container maxWidth="md" disableGutters sx={{ padding: '1rem' }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep - 1]}
        validateOnChange
        validateOnBlur={false}
      >
        {(formikProps) => (
          <>
            {!completed && (
              <Box sx={{ marginBottom: '65px' }}>
                <SomStepper
                  activeStep={activeStep - 1}
                  steps={GURB_REQUIREMENTS_SUBSTEPS}
                />
              </Box>
            )}
            {completed ? (
              <Box sx={{ mt: 2 }}>
                <GurbRequirementsResult {...formikProps} />
              </Box>
            ) : (
              getStep(formikProps)
            )}
            {!completed && (
              <Grid
                container
                direction="row-reverse"
                rowSpacing={2}
                sx={{
                  marginTop: '2rem',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {activeStep > 1 && (
                  <Grid item sm={2} xs={12}>
                    <PrevButton onClick={prevStep} title="PREV" />
                  </Grid>
                )}
                <Grid item sm={2} xs={12} order={-1}>
                  {activeStep !== MAX_STEP_NUMBER && (
                    <NextButton
                      disabled={
                        loading ||
                        !formikProps.isValid ||
                        (activeStep === 2 &&
                          !formikProps.values.address.inside_perimeter) ||
                        (activeStep === 3 &&
                          formikProps.values.has_light !== 'light-on') ||
                        (activeStep === 4 &&
                          formikProps.values.has_selfconsumption !==
                            'selfconsumption-off')
                      }
                      onClick={() => nextStep(formikProps)}
                      title="NEXT"
                    />
                  )}
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Formik>
    </Container>
  )
}

export default GurbFormRequirements
