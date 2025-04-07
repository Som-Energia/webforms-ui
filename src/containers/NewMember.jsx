import { useState, useEffect, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import PrevButton from './Gurb/components/PrevButton'
import NextButton from './Gurb/components/NextButton'
import SubmitButton from './Gurb/components/SubmitButton'
import { memberIdentifierValidations } from './Gurb/newMemberValidations'

import noValidation from '../formValidations/noValidation'

import GurbLoadingContext from '../context/GurbLoadingContext'
import SummaryContext from '../context/SummaryContext'
import MemberIdentifier from './NewMember/MemberIdentifier'
import MemberPersonalData from './NewMember/MemberPersonalData'
import PaymentMethod from './NewMember/PaymentMethod'
import MemberSummary from './NewMember/MemberSummary'

const MAX_STEP_NUMBER = 3
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
    is_client: undefined,
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
      gender: '',
      birthdate: undefined,
      email: undefined,
      email2: undefined,
      phone1: undefined,
      phone2: undefined,
      language: `${i18n.language}_ES`,
      how_meet_us: undefined,
      privacy_policy_accepted: false
    },
    privacy_policy_accepted: false,
    generic_especific_conditons_accepted: false
  }

  const validationSchemas = [
    memberIdentifierValidations,
    noValidation,
    noValidation,
    noValidation
  ]

  const nextStep = (formikProps) => {
    let next
    if (summaryField && activeStep !== 3) {
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
      return <PaymentMethod {...props} />
    } else {
      return <MemberSummary {...props} />
    }
  }

  const formikRef = useRef(null)

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
