import React, { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import Requirements from './Gurb/Requirements'

import PrevButton from '../components/NewButtons/PrevButton'
import NextButton from '../components/NewButtons/NextButton'
import SubmitButton from '../components/NewButtons/SubmitButton'
import supplyPointValidations from './Gurb/supplyPointValidations'
import {
  addressValidations,
  lightValidations,
  selfConsumptionValidations
} from './Gurb/requirementsValidations'

import GurbErrorContext from '../context/GurbErrorContext'
import GurbLoadingContext from '../context/GurbLoadingContext'

import { GURB_REQUIREMENTS_STEP } from '../services/steps'

const MAX_STEP_NUMBER = 3

const GurbFormValidations = (props) => {
  const { i18n, t } = useTranslation()
  const { language, id } = useParams()

  const { error, setError, errorInfo, setErrorInfo } =
    useContext(GurbErrorContext)

  const { loading } = useContext(GurbLoadingContext)

  const [activeStep, setActiveStep] = useState(0)
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const initialValues = {
    is_client: undefined,
    cups: '',
    has_light: undefined,
    address: {
      street: '',
      number: undefined,
      postal_code: undefined,
      state: undefined,
      city: undefined,
      lat: undefined,
      long: undefined
    },
    has_selfconsumption: undefined,
    has_member: undefined
  }

  const validationSchemas = [
    supplyPointValidations,
    addressValidations,
    lightValidations,
    selfConsumptionValidations
  ]

  const nextStep = (formikProps) => {
    let next = activeStep + 1
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = (formikProps) => {
    let prev = activeStep - 1
    setActiveStep(Math.max(0, prev))
  }

  const getStep = (props) => {
    return (
      <Requirements
        {...props}
        activeStep={activeStep}
        stepperSteps={GURB_REQUIREMENTS_STEP}
        stepperActiveStep={GURB_REQUIREMENTS_STEP}
      />
    )
  }

  const formikRef = useRef(null)
  useEffect(() => {
    formikRef.current.validateForm()
    if (activeStep === 8) {
      NewMemberResult()
    }
  }, [activeStep])

  return (
    <Container maxWidth="md" disableGutters={true} sx={{ padding: '1rem' }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        // validationSchema={validationSchemas[activeStep]}
        validationSchema={null}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) => {
          return (
            <>
              {getStep(formikProps)}
              {error ? (
                <></>
              ) : (
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
                        disabled={loading || !formikProps.isValid}
                          onClick={() => {
                            window.location.href = "http://gurb-join.example"
                          }}
                      />
                    )}
                  </Grid>
                </Grid>
              )}
            </>
          )
        }}
      </Formik>
    </Container>
  )
}

export default GurbFormValidations
