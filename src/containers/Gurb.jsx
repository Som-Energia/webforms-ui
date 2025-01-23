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

import PrevButton from './Gurb/components/PrevButton'
import NextButton from './Gurb/components/NextButton'
import supplyPointValidations from './Gurb/supplyPointValidations'
import {
  addressValidations,
  lightValidations,
  memberQuestionValidations,
  selfConsumptionValidations
} from './Gurb/requirementsValidations'
import newMemberValidations from './Gurb/newMemberValidations'
import {
  holderIbanValidations,
  holderIdentificationValidations,
  holderPersonalDataValidations,
  holderTaxAddressValidations,
  supplyPointDataValidations,
  holderVoluntaryDonationValidations,
  powerValidations
} from './Gurb/contractValidations'

import GurbErrorContext from '../context/GurbErrorContext'
import GurbLoadingContext from '../context/GurbLoadingContext'

const MAX_STEP_NUMBER = 13
const REQUIREMENTS_STEPS = [1, 2, 3, 4]
const NEW_MEMBER_STEP = [5]
const CONTRACT_STEPS = [6, 7, 8, 9, 10, 11, 12, 13]

const Gurb = (props) => {
  const { i18n, t } = useTranslation()
  const { language } = useParams()
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
      supply_point_accepted: false
    },
    contract: {
      power_type: undefined,
      power: {
        power1: undefined,
        power2: undefined,
        power3: undefined
      }
    }
  }

  const validationSchemas = [
    supplyPointValidations,
    lightValidations,
    addressValidations,
    selfConsumptionValidations,
    memberQuestionValidations,
    newMemberValidations,
    holderIdentificationValidations,
    holderPersonalDataValidations,
    holderTaxAddressValidations,
    powerValidations,
    supplyPointDataValidations,
    holderVoluntaryDonationValidations,
    holderIbanValidations
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
    } else if (NEW_MEMBER_STEP.includes(activeStep)) {
      return <NewMember {...props} />
    } else if (CONTRACT_STEPS.includes(activeStep)) {
      return (
        <Contract {...props} activeStep={CONTRACT_STEPS.indexOf(activeStep)} />
      )
    } else {
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
    if (activeStep === 6) {
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
export default Gurb
