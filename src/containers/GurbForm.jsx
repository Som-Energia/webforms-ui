import { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import SupplyPoint from './Gurb/SupplyPoint'
import Requirements from './Gurb/Requirements'
import NewMember from './Gurb/NewMember'
import Contract from './Gurb/Contract'
import Gurb from './Gurb/Gurb'

import PrevButton from './Gurb/components/PrevButton'
import NextButton from './Gurb/components/NextButton'
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

import {
  gurbPowerOptions,
  gurbPolicyChecks
} from './Gurb//GurbValidations'

import GurbErrorContext from '../context/GurbErrorContext'
import GurbLoadingContext from '../context/GurbLoadingContext'

const MAX_STEP_NUMBER = 20
const REQUIREMENTS_STEPS = [1, 2, 3, 4]
const NEW_MEMBER_STEP = [5, 6, 7]
const CONTRACT_STEPS = [8, 9, 10, 11, 12, 13, 14, 15, 16]
const GURB_STEPS = [17, 18, 19]

const GurbForm = (props) => {
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
    gurbPowerOptions,
    gurbPowerOptions,
    gurbPolicyChecks
  ]

  const nextStep = (formikProps) => {
    let next = activeStep + 1
    if (activeStep === 4) {
      if (formikProps.values.has_member === 'member-off') {
        next = activeStep + 2
      }
      else if (formikProps.values.has_member === 'apadrinating') {
        next = activeStep + 3
      }
    }
    else if (NEW_MEMBER_STEP.includes(activeStep)) {
      next = 8
    }
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = (formikProps) => {
    let prev = activeStep - 1
    if (activeStep === 8) {
      if (formikProps.values.has_member === 'member-off') {
        prev = activeStep - 2
      }
      else if (formikProps.values.has_member === 'member-on') {
        prev = activeStep - 3
      }
    }
    else if (NEW_MEMBER_STEP.includes(activeStep)) {
      prev = 4
    }
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
    } else if (NEW_MEMBER_STEP.includes(activeStep)) {
      return <NewMember {...props} activeStep={NEW_MEMBER_STEP.indexOf(activeStep)} />
    } else if (CONTRACT_STEPS.includes(activeStep)) {
      return (
        <Contract {...props} activeStep={CONTRACT_STEPS.indexOf(activeStep)} />
      )
    } else if (GURB_STEPS.includes(activeStep)) {
      return (<Gurb {...props} activeStep={GURB_STEPS.indexOf(activeStep)} />)
    }
    else {
      return <></>
    }
  }

  const NewMemberResult = (props) => {
    if (formikRef.current.values.new_member.become_member) {
      setError(true)
      setErrorInfo({
        main_text: t('GURB_WELCOME_NEW_MEMBER_MAIN_TEXT'),
        seconday_text: t('GURB_WELCOME_NEW_MEMBER_SECONDARY_TEXT'),
        link_text: t('GURB_WELCOME_NEW_MEMBER_LINK_TEXT'),
        error_type: 'success',
        clean_field: () => {
          activeStep
        }
      })
    }
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
        validationSchema={validationSchemas[activeStep]}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) => {
          return (
            <>
              {getStep(formikProps)}
              {error ? (
                <></>
              ) : (
                <>
                  {activeStep === 0 ? (
                    <>
                      <Box
                        style={{
                          marginTop: '2rem',
                          marginX: '2rem',
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }}>
                        <NextButton
                          disabled={
                            loading ||
                            !formikProps.isValid ||
                            activeStep === MAX_STEP_NUMBER
                          }
                          onClick={() => nextStep(formikProps)}
                          title={'NEXT'}
                        />
                      </Box>
                    </>
                  ) : (
                    <Box
                      style={{
                        marginTop: '2rem',
                        marginX: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                      <PrevButton
                        onClick={() => prevStep(formikProps)}
                        title={'PREV'}
                      />
                      <NextButton
                        disabled={
                          loading ||
                          !formikProps.isValid ||
                          activeStep === MAX_STEP_NUMBER
                        }
                        onClick={() => nextStep(formikProps)}
                        title={'NEXT'}
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )
        }}
      </Formik>
    </Container>
  )
}
<<<<<<< HEAD

export default GurbForm
=======
export default GurbForm
>>>>>>> ✨ Added Gurb section inside GurbForm
