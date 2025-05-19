import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'

import Container from '@mui/material/Container'

import NewContractMemberQuestion from './NewContract/NewContractMemberQuestion'
import newContractMemberQuestionValidations from './NewContract/newContractMemberQuestionValidations'

const NewContractForm = (props) => {
  const { i18n, t } = useTranslation()
  const { language, tariff } = useParams()

  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const initialValues = {
    selectedUrl: '',
    tariff: tariff
  }
 
  const validationSchemas = [
    newContractMemberQuestionValidations
  ]
  
  const formikRef = useRef(null)

  return (
    <Container maxWidth="md" disableGutters={true} sx={{ padding: '1rem' }}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchemas[activeStep]}
        validateOnChange={true}
        validateOnBlur={false}>
        {(formikProps) => {
          return <NewContractMemberQuestion {...formikProps} />
        }}
      </Formik>
    </Container>
  )
}

export default NewContractForm
