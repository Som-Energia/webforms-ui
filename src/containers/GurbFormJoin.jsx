import { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import PrevButton from '../components/NewButtons/PrevButton'
import NextButton from '../components/NewButtons/NextButton'
import SubmitButton from '../components/NewButtons/SubmitButton'

import { identifierValidations, gurbPowerOptions, gurbPolicyChecks } from './Gurb/GurbValidations'

import GurbErrorContext from '../context/GurbErrorContext'
import GurbLoadingContext from '../context/GurbLoadingContext'
import { addGurb } from '../services/api'
import { GURB_FORM_SUBSTEPS } from '../services/steps'

import SomStepper from '../components/NewSomStepper'

// Step components
import GurbIdentification from './Gurb/pages/Gurb/GurbIdentification'
import GurbParticipation from './Gurb/pages/Gurb/GurbParticipation'
import ContractReview from './Gurb/pages/Gurb/ContractReview'
import GurbSignature from './Gurb/pages/Gurb/GurbSignature'
import Payment from './Gurb/pages/Gurb/Payment'

const MAX_STEP_NUMBER = 4
const NEW_MEMBER_COST = 100

const GurbFormJoin = (props) => {
  const { i18n } = useTranslation()
  const { language, code } = useParams()
  const [url, setUrl] = useState('')
  const [data, setData] = useState()
  const formTPV = useRef(null)

  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)
  const { loading } = useContext(GurbLoadingContext)

  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const initialValues = useMemo(() => ({
    new_contract: undefined,
    tariff_name: '',
    cups: '',
    gurb: {
      power: '',
      daily_cost: '',
      join_cost: ''
    },
    privacy_policy_accepted: false,
    generic_especific_conditons_accepted: false,
    tariff_payment_accepted: false,
    gurb_adhesion_payment_accepted: false
  }), [])

  const validationSchemas = useMemo(() => [identifierValidations, gurbPowerOptions, gurbPolicyChecks], [])

  const handlePost = useCallback(async (values) => {
    await addGurb(values)
      .then((response) => {
        setData(response?.data)
        setUrl(response.data.endpoint)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const formikRef = useRef(null)
  useEffect(() => {
    formikRef.current.validateForm()
  }, [activeStep])

  useEffect(() => {
    if (url !== '') {
      formTPV.current.submit()
    }
  }, [url])

  const nextStep = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, MAX_STEP_NUMBER))
  }, [])

  const prevStep = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1))
  }, [])

  const getStep = (formikProps) => {
    if (activeStep === 0) {
      return <GurbIdentification {...formikProps} />
    } else if (activeStep === 1) {
      return <GurbParticipation {...formikProps} gurbCode={code} />
    } else if (activeStep === 2) {
      return <ContractReview {...formikProps} activeStep={activeStep} />
    } else if (activeStep === 3) {
      return <GurbSignature {...formikProps} activeStep={activeStep} />
    } else {
      return <Payment {...formikProps} activeStep={activeStep} />
    }
  }

  return (
    <Container maxWidth="md" disableGutters sx={{ padding: '1rem' }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        validateOnChange
        validateOnBlur={false}
      >
        {(formikProps) => (
          <>
            <SomStepper
              activeStep={activeStep}
              steps={GURB_FORM_SUBSTEPS}
            />
            {error ? getStepResult(errorInfo) : getStep(formikProps)}

            {!error && (
              <Grid
                container
                direction="row-reverse"
                rowSpacing={2}
                sx={{
                  marginTop: '2rem',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {activeStep !== 0 && (
                  <Grid item sm={2} xs={12}>
                    <PrevButton onClick={() => prevStep(formikProps)} title="PREV" />
                  </Grid>
                )}
                <Grid item sm={2} xs={12} order={-1}>
                  {activeStep !== MAX_STEP_NUMBER ? (
                    <NextButton
                      disabled={loading || !formikProps.isValid || activeStep === MAX_STEP_NUMBER}
                      onClick={() => nextStep(formikProps)}
                      title="NEXT"
                    />
                  ) : (
                    <SubmitButton
                      disabled={loading || !formikProps.isValid}
                      onClick={() =>
                        handlePost({
                          soci: 'Eustaquio',
                          cost:
                            NEW_MEMBER_COST +
                            formikProps.values.contract.gurb_power_cost
                        })
                      }
                    />
                  )}
                </Grid>
              </Grid>
            )}
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
  )
}

export default GurbFormJoin
