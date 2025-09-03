import { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import Gurb from './Gurb/Gurb'

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
import { addGurb } from '../services/api'
import {
  GURB_FINAL_STEP,
  GURB_FORM_JOIN_STEPS,
} from '../services/steps'

const MAX_STEP_NUMBER = 4
const NEW_MEMBER_COST = 100

const GurbFormJoin = (props) => {
  const { i18n, t } = useTranslation()
  const { language, id } = useParams()
  const [url, setUrl] = useState('')
  const [data, setData] = useState()
  const formTPV = useRef(null)

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
  const handlePost = async (values) => {
    await addGurb(values)
      .then((response) => {
        setData(response?.data)
        setUrl(response.data.endpoint)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const getStep = (props) => {
      return (
        <Gurb
          {...props}
          activeStep={activeStep}
          stepperSteps={GURB_FORM_JOIN_STEPS}
          stepperActiveStep={GURB_FINAL_STEP}
        />
      )
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

  return (
    console.log('Active Step:', activeStep),
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
          )
        }}
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
