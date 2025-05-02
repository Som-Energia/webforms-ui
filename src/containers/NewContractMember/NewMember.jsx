import { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import PrevButton from '../../components/NewButtons/PrevButton'
import NextButton from '../../components/NewButtons/NextButton'
import SubmitButton from '../../components/NewButtons/SubmitButton'
import SomStepper from '../../components/SomStepper'

import { NEW_MEMBER_FORM_SUBSTEPS } from '../../services/steps'
import SummaryContext from '../../context/SummaryContext'
import GurbLoadingContext from '../../context/GurbLoadingContext'
import MemberIdentifier from '../NewMember/MemberIdentifier'
import MemberPersonalData from '../NewMember/MemberPersonalData'
import MemberSupplyPoint from './NewContractMemberSupplyPoint'
import MemberSupplyPointData from './NewContractMemberSupplyPointData'
import MemberSummary from '../NewMember/MemberSummary'

import memberIdentifierValidations from '../NewMember/memberIdentifierValidations'
import memberPersonalDataValidations from '../NewMember/memberPersonalDataValidations,'
import newContractMemberSupplyPointValidations from './newContractMemberSupplyPointValidations'
import newContractMemberSupplyPointDataValidations from './newContractMemberSupplyPointDataValidations'
import memberSummaryValidations from '../NewMember/memberSummaryValidations'

const MAX_STEP_NUMBER = 4
const NEW_MEMBER_COST = 100

const NewMemberForm = (props) => {
  const { i18n, t } = useTranslation()
  const { language } = useParams()
  const [url, setUrl] = useState('')
  const [data, setData] = useState()
  const formTPV = useRef(null)

  const { loading } = useContext(GurbLoadingContext)
  const { summaryField, setSummaryField } = useContext(SummaryContext)

  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const initialValues = {
    cups: '',
    has_light: undefined,
    supply_point: {
      cnae: '',
      cadastral_reference: '',
      supply_point_accepted: false,
    },
    supply_point_address: {
      street: '',
      number: '',
      floor: '',
      door: '',
      stairs: '',
      bloc: '',
      postal_code: '',
      state: undefined,
      city: undefined,
      lat: undefined,
      long: undefined
    },
    address: {
      street: '',
      number: '',
      floor: '',
      door: '',
      stairs: '',
      bloc: '',
      postal_code: '',
      state: undefined,
      city: undefined,
      lat: undefined,
      long: undefined
    },
    new_member: {
      nif: '',
      become_member: false,
      is_physical: undefined,
      proxynif_valid: false,
      proxynif: '',
      proxyname: '',
      name: '',
      surname1: '',
      surname2: '',
      gender: '',
      birthdate: undefined,
      email: '',
      email2: '',
      phone: '',
      phone_code: '+34',
      phone_valid: false,
      language: `${i18n.language}_ES`,
      how_meet_us: '',
      payment_method: undefined,
      sepa_accepted: false,
      iban: undefined,
      terms_accepted: false,
      comercial_info_accepted: false,
      legal_person_accepted: false
    },
    privacy_policy_accepted: false,
    generic_especific_conditons_accepted: false
  }

  const validationSchemas = [
    memberIdentifierValidations,
    memberPersonalDataValidations,
    newContractMemberSupplyPointValidations,
    newContractMemberSupplyPointDataValidations,
    memberSummaryValidations
  ]

  const nextStep = (formikProps) => {
    let next
    if (
      summaryField !== undefined &&
      activeStep !== NEW_MEMBER_FORM_SUBSTEPS['IDENTIFY_MEMBER']
    ) {
      next = MAX_STEP_NUMBER
      setSummaryField(undefined)
    } else {
      next = activeStep + 1
    }
    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = (formikProps) => {
    let prev = activeStep - 1
    setActiveStep(Math.max(0, prev))
  }

  const handlePost = async (values) => {
    console.log('POST final')
  }

  const getStep = (props) => {
    if (activeStep === 0) {
      return <MemberIdentifier {...props} />
    } else if (activeStep === 1) {
      return <MemberPersonalData {...props} />
    } else if (activeStep === 2) {
      return <MemberSupplyPoint {...props} />
    } else if (activeStep === 3) {
      return <MemberSupplyPointData {...props} />
    } else {
      return <MemberSummary {...props} />
    }
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

  useEffect(() => {
    if (summaryField !== undefined) {
      setActiveStep(summaryField)
    }
  }, [summaryField])

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
              <SomStepper
                activeStep={activeStep}
                steps={NEW_MEMBER_FORM_SUBSTEPS}
              />
              {getStep(formikProps)}
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
                      disabled={!formikProps.isValid}
                      onClick={() => handlePost()}
                    />
                  )}
                </Grid>
              </Grid>
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

export default NewMemberForm
