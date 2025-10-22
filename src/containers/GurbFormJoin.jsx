import {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback
} from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import PrevButton from '../components/NewButtons/PrevButton'
import NextButton from '../components/NewButtons/NextButton'
import SubmitButton from '../components/NewButtons/SubmitButton'
import SomStepper from '../components/NewSomStepper'

import {
  identifierValidations,
  gurbPowerOptions,
  gurbPolicyChecks
} from './Gurb/GurbValidations'

import GurbErrorContext from '../context/GurbErrorContext'
import GurbLoadingContext from '../context/GurbLoadingContext'

// Step components
import GurbIdentification from './Gurb/pages/Gurb/GurbIdentification'
import GurbParticipation from './Gurb/pages/Gurb/GurbParticipation'
import ContractReview from './Gurb/pages/Gurb/ContractReview'
import GurbSignature from './Gurb/pages/Gurb/GurbSignature'

const MAX_STEPS_NUMBER = 4

const GurbFormJoin = (props) => {
  const { i18n } = useTranslation()
  const { language, code } = useParams()

  const [redsysData, setRedsysData] = useState()
  const [validSignature, setValidSignature] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [submitAction, setSubmitAction] = useState(false)

  const formTPV = useRef(null)

  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)
  const { loading } = useContext(GurbLoadingContext)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const formikRef = useRef(null)
  useEffect(() => {
    formikRef.current.validateForm()
  }, [activeStep])

  useEffect(() => {
    if (redsysData && validSignature && formTPV.current) {
      formTPV.current.submit()
    }
  }, [redsysData, validSignature, submitAction])

  const initialValues = useMemo(
    () => ({
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
      gurb_adhesion_payment_accepted: false,
      payment_data: undefined
    }),
    []
  )

  const validationSchemas = useMemo(
    () => [identifierValidations, gurbPowerOptions, gurbPolicyChecks],
    []
  )

  const nextStep = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, MAX_STEPS_NUMBER))
  }, [])

  const prevStep = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1))
  }, [])

  const getStep = (formikProps) => {
    switch (activeStep) {
      case 0:
        return <GurbIdentification {...formikProps} />
      case 1:
        return <GurbParticipation {...formikProps} gurbCode={code} />
      case 2:
        return <ContractReview {...formikProps} activeStep={activeStep} />
      case 3:
        return (
          <GurbSignature
            {...formikProps}
            setValidSignature={setValidSignature}
            gurbCode={code}
            setRedsysData={setRedsysData}
          />
        )
      default:
        return null
    }
  }

  return (
    <Container maxWidth="md" disableGutters sx={{ padding: '1rem' }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        validateOnChange
        validateOnBlur={false}>
        {(formikProps) => (
          <>
            <SomStepper
              activeStep={activeStep}
              steps={[...Array(MAX_STEPS_NUMBER).keys()]}
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
                }}>
                {activeStep !== 0 && (
                  <Grid item sm={2} xs={12}>
                    <PrevButton
                      onClick={() => prevStep(formikProps)}
                      title="PREV"
                      disabled={activeStep === 3 && validSignature}
                    />
                  </Grid>
                )}

                <Grid item sm={2} xs={12} order={-1}>
                  {activeStep === 3 ? (
                    <SubmitButton
                      text="GURB_NEXT_PAYMENT"
                      disabled={
                        loading || !formikProps.isValid || !validSignature
                      }
                      onClick={() => setSubmitAction(true)}
                    />
                  ) : (
                    <NextButton
                      disabled={loading || !formikProps.isValid}
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

      {redsysData && validSignature && submitAction && (
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

export default GurbFormJoin
