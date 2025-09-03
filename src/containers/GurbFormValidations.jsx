import { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import SupplyPoint from './Gurb/SupplyPoint'
import Requirements from './Gurb/Requirements'

import PrevButton from '../components/NewButtons/PrevButton'
import NextButton from '../components/NewButtons/NextButton'
import SubmitButton from '../components/NewButtons/SubmitButton'
import supplyPointValidations from './Gurb/supplyPointValidations'
import {
  addressValidations,
  lightValidations,
  memberQuestionValidations,
  selfConsumptionValidations
} from './Gurb/requirementsValidations'
import {
  newMemberValidations,
  alreadyMemberValidations,
  apadrinatingValidations
} from './Gurb/newMemberValidations'
import {
  holderIbanValidations,
  holderIdentificationValidations,
  holderPersonalDataValidations,
  holderTaxAddressValidations,
  supplyPointDataValidations,
  holderVoluntaryDonationValidations,
  powerValidations,
  tariffModeValidations
} from './Gurb/contractValidations'

import noValidation from '../formValidations/noValidation'

import { gurbPowerOptions, gurbPolicyChecks } from './Gurb/GurbValidations'

import GurbErrorContext from '../context/GurbErrorContext'
import GurbLoadingContext from '../context/GurbLoadingContext'

import {
  GURB_FORM_REQUIREMENTS_STEPS,
  GURB_REQUIREMENTS_STEP,
} from '../services/steps'

const MAX_STEP_NUMBER = 3
const REQUIREMENTS_STEPS = [1, 2, 3]

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
    tax_address: {
      has_different_address: undefined,
      street: '',
      number: undefined,
      postal_code: undefined,
      state: undefined,
      city: undefined
    },
    has_selfconsumption: undefined,
    has_member: undefined,
    member: {
      number: '',
      nif: '',
      is_member: false,
      link_member: false
    },
    new_member: {
      nif: '',
      become_member: false,
      isphisical: true,
      proxynif_valid: false,
      proxynif: '',
      proxyname: '',
      name: undefined,
      surname1: undefined,
      surname2: undefined,
      email: undefined,
      email2: undefined,
      phone1: undefined,
      phone2: undefined,
      language: `${i18n.language}_ES`,
      privacy_policy_accepted: false
    },
    holder: {
      nif: '',
      has_holder: undefined,
      name: undefined,
      surname1: undefined,
      surname2: undefined,
      email: undefined,
      email2: undefined,
      phone1: undefined,
      phone2: undefined,
      voluntary_donation: undefined,
      iban: '',
      iban_valid: false,
      direct_debit_accepted: false
    },
    cadastral_reference: '',
    cadastral_reference_valid: true,
    supply_point: {
      is_housing: undefined,
      cnae: undefined,
      supply_point_accepted: false
    },
    contract: {
      tariff_mode: undefined,
      power_type: undefined,
      power: {
        power1: undefined,
        power2: undefined,
        power3: undefined
      },
      gurb_power: '',
      gurb_power_cost: ''
    },
    privacy_policy_accepted: false,
    generic_especific_conditons_accepted: false,
    tariff_payment_accepted: false,
    gurb_adhesion_payment_accepted: false
  }

  const validationSchemas = [
    supplyPointValidations,
    lightValidations,
    addressValidations,
    selfConsumptionValidations,
    memberQuestionValidations,
    alreadyMemberValidations,
    newMemberValidations,
    apadrinatingValidations,
    holderIdentificationValidations,
    holderPersonalDataValidations,
    holderTaxAddressValidations,
    supplyPointDataValidations,
    powerValidations,
    tariffModeValidations,
    holderVoluntaryDonationValidations,
    holderIbanValidations,
    noValidation,
    gurbPowerOptions,
    gurbPolicyChecks
  ]

  const nextStep = (formikProps) => {
    let next = activeStep + 1
    if (activeStep === 4) {
      if (formikProps.values.has_member === 'member-off') {
        next = activeStep + 2
      } else if (formikProps.values.has_member === 'apadrinating') {
        next = activeStep + 3
      }
    }
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = (formikProps) => {
    let prev = activeStep - 1
    if (activeStep === 8) {
      if (formikProps.values.has_member === 'member-off') {
        prev = activeStep - 2
      } else if (formikProps.values.has_member === 'member-on') {
        prev = activeStep - 3
      }
    }
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
