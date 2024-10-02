import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import SupplyPoint from './Gurb/SupplyPoint'
import Requirements from './Gurb/Requirements'

import PrevButton from './Gurb/components/PrevButton'
import NextButton from './Gurb/components/NextButton'
import supplyPointValidations from './Gurb/supplyPointValidations'
import {
  addressValidations,
  lightValidations,
  memberQuestionValidations,
  selfConsumptionValidations
} from './Gurb/requirementsValidations'

const MAX_STEP_NUMBER = 6
const REQUIREMENTS_STEPS = [1, 2, 3, 4]

const Gurb = (props) => {
  const { i18n } = useTranslation()
  const { language } = useParams()
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const initialValues = {
    cups: undefined,
    has_light: undefined,
    address: {
      street: undefined,
      number: undefined,
      postal_code: undefined,
      state: undefined,
      city: undefined
    },
    has_selfconsumption: undefined,
    has_member: undefined
  }

  const validationSchemas = [
    supplyPointValidations,
    lightValidations,
    addressValidations,
    selfConsumptionValidations,
    memberQuestionValidations
  ]

  const nextStep = () => {
    const next = activeStep + 1
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = () => {
    const prev = activeStep - 1
    setActiveStep(Math.max(0, prev))
  }

  const getStep = (props) => {
    if (activeStep === 0) {
      return <SupplyPoint {...props} />
    } else if (REQUIREMENTS_STEPS.includes(activeStep)) {
      return (
        <Requirements
          {...props}
          activeStep={REQUIREMENTS_STEPS.indexOf(activeStep)}
        />
      )
    } else {
      return <></>
    }
  }

  const formikRef = useRef(null)
  useEffect(() => {
    formikRef.current.validateForm()
  }, [activeStep])

  return (
    <Container maxWidth="md" disableGutters={true} sx={{ padding: '1rem' }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) => {
          return (
            <>
              {getStep(formikProps)}
              {<Box
                style={{
                  marginTop: '2rem',
                  marginX: '2rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                <PrevButton
                  disabled={activeStep === 0}
                  onClick={() => prevStep(formikProps)}
                  title={'PREV'}
                />
                <NextButton
                  disabled={
                    !formikProps.isValid || activeStep === MAX_STEP_NUMBER
                  }
                  onClick={() => nextStep(formikProps)}
                  title={'NEXT'}
                />
              </Box>}
            </>
          )
        }}
      </Formik>
    </Container>
  )
}
export default Gurb
