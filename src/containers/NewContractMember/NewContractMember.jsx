import { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import PrevButton from '../../components/NewButtons/PrevButton'
import NextButton from '../../components/NewButtons/NextButton'
import SubmitButton from '../../components/NewButtons/SubmitButton'
import SomStepper from '../../components/NewSomStepper'

import { NEW_MEMBER_CONTRACT_FORM_SUBSTEPS, NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS } from '../../services/steps'
import SummaryContext from '../../context/SummaryContext'
import GurbLoadingContext from '../../context/GurbLoadingContext'
import MemberIdentifier from '../NewMember/MemberIdentifier'
import MemberPersonalData from '../NewMember/MemberPersonalData'
import NewContractMemberQuestion from './NewContractMemberQuestion'
import NewContractMemberSupplyPoint from './NewContractMemberSupplyPoint'
import NewContractMemberSupplyPointData from './NewContractMemberSupplyPointData'
import NewContractMemberPower from './NewContractMemberPower'
import NewContractMemberSelfConsumptionChooser from './NewContractMemberSelfConsumptionChooser'
import NewContractMemberSelfConsumptionData from './NewContractMemberSelfConsumptionData'
import NewContractMemberHolder from './NewContractMemberHolder'
import NewContractMemberVoluntaryDonation from './NewContractMemberVoluntaryDonation'
import NewContractMemberPayment from './NewContractMemberPayment'
import NewContractMemberSummary from './NewContractMemberSummary'
import IdentifyMemberPersonalData from './IdentifyMemberPersonalData'

import memberIdentifierValidations from '../NewMember/memberIdentifierValidations'
import memberPersonalDataValidations from '../NewMember/memberPersonalDataValidations'
import newContractMemberQuestionValidations from './newContractMemberQuestionValidations'
import newContractMemberSupplyPointValidations from './newContractMemberSupplyPointValidations'
import newContractMemberSupplyPointDataValidations from './newContractMemberSupplyPointDataValidations'
import newContractMemberPowerValidations from './newContractMemberPowerValidations'
import newContractMemberSelfConsumptionValidations from './newContractMemberSelfConsumptionValidations'
import newContractMemberSelfConsumptionDataValidations from './newContractMemberSelfConsumptionDataValidations'
import newContractMemberHolderValidations from './newContractMemberHolderValidations'
import newContractMemberVoluntaryDonationValidations from './newContractMemberVoluntaryDonationValidations'
import newContractMemberPaymentValidations from './newContractMemberPaymentValidations'
import newContractMemberSummaryValidations from './newContractMemberSummaryValidations'
import ApadrinatingDetails from '../Gurb/pages/NewMember/ApadrinatingDetails'
import linkMemberValidations from '../Gurb/pages/NewMember/linkMemberDetailsValidations'
import identifyMemberPersonalDataValidations from './identifyMemberPersonalDataValidations'

const NewContractMemberForm = (props) => {
  const { i18n, t } = useTranslation()
  const { language } = useParams()
  const [url, setUrl] = useState('')
  const [data, setData] = useState()
  const formTPV = useRef(null)

  const { loading } = useContext(GurbLoadingContext)
  const { summaryField, setSummaryField } = useContext(SummaryContext)

  const [activeStep, setActiveStep] = useState(0)
  const [validationSteps, setValidationSteps] = useState([newContractMemberQuestionValidations])
  const [formSteps, setFormSteps] = useState({})
  const [MAX_STEP_NUMBER, setMAX_STEP_NUMBER] = useState(11)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const initialValues = {
    cups: '',
    has_member: undefined,
    member_is_holder: undefined,
    has_light: undefined,
    previous_holder: undefined,
    voluntary_donation: undefined,
    cadastral_reference: undefined,
    cadastral_reference_valid: true,
    supply_point: {
      cnae: '',
      supply_point_accepted: false,
      is_housing: undefined
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
    member: {
      number: '',
      nif: ''
    },
    new_member: {
      nif: '',
      become_member: false,
      person_type: '',
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
      legal_person_accepted: false
    },
    contract: {
      tariff_mode: '',
      power_type: '',
      power: {
        power1: '',
        power2: '',
        power3: '',
        power4: '',
        power5: '',
        power6: ''
      }
    },
    has_selfconsumption: undefined,
    self_consumption: {
      cau: undefined,
      cau_error: false,
      collective_installation: undefined,
      installation_type: '',
      technology: 'b11',
      aux_services: undefined,
      installation_power: ''
    },
    privacy_policy_accepted: false,
    generic_conditions_accepted: false,
    statutes_accepted: false,
    comercial_info_accepted: false
  }

  const validationSchemasLinkMember = [
      newContractMemberQuestionValidations,
      linkMemberValidations,
      newContractMemberSupplyPointValidations,
      newContractMemberSupplyPointDataValidations,
      newContractMemberPowerValidations,
      newContractMemberSelfConsumptionValidations,
      newContractMemberSelfConsumptionDataValidations,
      newContractMemberHolderValidations,
      identifyMemberPersonalDataValidations,
      newContractMemberVoluntaryDonationValidations,
      newContractMemberPaymentValidations,
      newContractMemberSummaryValidations
    ]

  const validationSchemasNewMember = [
      newContractMemberQuestionValidations,
      memberIdentifierValidations,
      memberPersonalDataValidations,
      newContractMemberSupplyPointValidations,
      newContractMemberSupplyPointDataValidations,
      newContractMemberPowerValidations,
      newContractMemberSelfConsumptionValidations,
      newContractMemberSelfConsumptionDataValidations,
      newContractMemberHolderValidations,
      newContractMemberVoluntaryDonationValidations,
      newContractMemberPaymentValidations,
      newContractMemberSummaryValidations
    ]

  const setValidationSchemaAndSteps = (has_member) => {
    if (has_member == 'member-off')
    {
      setValidationSteps(validationSchemasNewMember)
      setFormSteps(NEW_MEMBER_CONTRACT_FORM_SUBSTEPS)
      setMAX_STEP_NUMBER(Object.keys(NEW_MEMBER_CONTRACT_FORM_SUBSTEPS).length)
    } else if (has_member == 'member-on')
    {
      setValidationSteps(validationSchemasLinkMember)
      setFormSteps(NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS)
      setMAX_STEP_NUMBER(Object.keys(NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS).length)
    } else {
      setValidationSteps(newContractMemberQuestionValidations)
      setFormSteps({})
      setMAX_STEP_NUMBER(11)
    }
  }

  const nextStep = (formikProps) => {
    let next
    if (
      summaryField !== undefined &&
      activeStep !== formSteps['IDENTIFY_MEMBER']
    ) {
      next = MAX_STEP_NUMBER
      setSummaryField(undefined)
    } else {
      next = activeStep + 1
    }

    if (
      activeStep === formSteps['SELFCONSUMPTION'] &&
      formikProps.values.has_selfconsumption === 'selfconsumption-off'
    ) {
      next = next + 1
    }

    if (
      activeStep === formSteps['HOLDER_INFO'] &&
      formikProps.values.member_is_holder === 'holder-member-yes'
    ) {
      next = next + 1
    }

    const last = MAX_STEP_NUMBER
    setActiveStep(Math.min(next, last))
  }

  const prevStep = (formikProps) => {
    let prev = activeStep - 1
    if (
      activeStep === formSteps['HOLDER_INFO'] &&
      formikProps.values.has_selfconsumption === 'selfconsumption-off'
    ) {
      prev = prev - 1
    }

    if (
      activeStep === formSteps['DONATION'] &&
      formikProps.values.member_is_holder === 'holder-member-yes'
    ) {
      prev = prev - 1
    }

    setActiveStep(Math.max(0, prev))
  }

  const handlePost = async (values) => {
    console.log('POST final')
  }

  const getStep = (props) => {
    const { values } = props

    if (values?.has_member == 'member-off')
    {
      if (activeStep === 1) {
        return <MemberIdentifier {...props} />
      } else if (activeStep === 2) {
        return <MemberPersonalData {...props} />
      } else if (activeStep === 3) {
        return <NewContractMemberSupplyPoint {...props} />
      } else if (activeStep === 4) {
        return <NewContractMemberSupplyPointData {...props} />
      } else if (activeStep === 5) {
        return <NewContractMemberPower {...props} />
      } else if (activeStep === 6) {
        return <NewContractMemberSelfConsumptionChooser {...props} />
      } else if (activeStep === 7) {
        return <NewContractMemberSelfConsumptionData {...props} />
      } else if (activeStep === 8) {
        return <NewContractMemberHolder {...props} />
      } else if (activeStep === 9) {
        return <NewContractMemberVoluntaryDonation {...props} />
      } else if (activeStep === 10) {
        return <NewContractMemberPayment {...props} />
      } else {
        return <NewContractMemberSummary {...props} />
      }
    } else {

      if (activeStep === 1) {
        return <ApadrinatingDetails {...props} />
      } else if (activeStep === 2) {
        return <NewContractMemberSupplyPoint {...props} />
      } else if (activeStep === 3) {
        return <NewContractMemberSupplyPointData {...props} />
      } else if (activeStep === 4) {
        return <NewContractMemberPower {...props} />
      } else if (activeStep === 5) {
        return <NewContractMemberSelfConsumptionChooser {...props} />
      } else if (activeStep === 6) {
        return <NewContractMemberSelfConsumptionData {...props} />
      } else if (activeStep === 7) {
        return <NewContractMemberHolder {...props} />
      } else if (activeStep === 8) {
        return <IdentifyMemberPersonalData {...props} />
      } else if (activeStep === 9) {
        return <NewContractMemberVoluntaryDonation {...props} />
      } else if (activeStep === 10) {
        return <NewContractMemberPayment {...props} />
      } else {
        return <NewContractMemberSummary {...props} />
      }
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
        validationSchema={validationSteps[activeStep]}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) => {
          return (
            <>
              {activeStep == 0 ? (
                <NewContractMemberQuestion formikProps={formikProps} nextStep={nextStep} setValidationSchemaAndSteps={setValidationSchemaAndSteps}/>
              ) : (
                <>
                  <SomStepper
                    activeStep={activeStep - 1} // because step 0 does not count
                    steps={formSteps}
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

export default NewContractMemberForm
