import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from './InputField'

import { checkCadastralReference } from '../services/api'
import GurbLoadingContext from '../context/GurbLoadingContext'
import { useTheme } from '@mui/material/styles'

const CadastralReference = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched
  } = props

  const theme = useTheme()
  const { t } = useTranslation()
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handleCheckCadastralReferenceResponse = async () => {
    let status = undefined
    setLoading(true)
    await checkCadastralReference(values?.cadastral_reference)
      .then((response) => {
        status = response?.state
      })
      .catch(() => {
        status = false
      })
    if (status === true) {
      await setFieldError('cadastral_reference', undefined)
      setFieldValue('cadastral_reference_valid', true)
    } else {
      await setFieldError(
        'cadastral_reference',
        t('INVALID_REF_CADASTRAL_CONTROL_DIGIT')
      )
      setFieldValue('cadastral_reference_valid', false)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (values?.cadastral_reference?.length < 1) {
      setFieldValue('cadastral_reference_valid', true)
    } else if (values?.cadastral_reference?.length > 19) {
      handleCheckCadastralReferenceResponse()
    }
  }, [values?.cadastral_reference, setFieldValue])

  const handleInputCadastralReference = (event) => {
    let value = event.target.value
    value = value.replace(/[^0-9A-Za-z]/g, '') // TODO: Do not cut chars after not matching one
    // value = value.slice(0, 20)
    value = value.toUpperCase()
    value = [
      value.slice(0, 7), // Finca/Parcela
      value.slice(7, 14), // Hoja
      value.slice(14, 18), // Local/Piso
      value.slice(18, 20) // Control
    ]
      .join(' ')
      .trim()
    setFieldValue('cadastral_reference', value)
  }

  const handleInputCadastralReferenceBlur = () => {
    setFieldTouched('cadastral_reference', true)
  }

  return (
    <InputField
      textFieldLabel={t('CADASTRAL_REFERENCE')}
      textFieldName={t('CADASTRAL_REFERENCE')}
      textFieldHelper={
        <span>
          {t('CADASTRAL_REFERENCE_HELPER')}{' '}
          <a
            href={t('HELP_CADASTRAL_REFERENCE_URL')}
            target="_blank"
            rel="noopener noreferrer"
            style={{color: theme.palette.secondary.main, textDecoration: 'underline' }}>
            {t('CADASTRAL_REFERENCE_LINK')}
          </a>
          </span>
      }
      iconHelper={true}
      handleChange={handleInputCadastralReference}
      handleBlur={handleInputCadastralReferenceBlur}
      touched={touched?.cadastral_reference}
      value={values?.cadastral_reference}
      error={errors?.cadastral_reference || errors?.cadastral_reference_valid}
      isLoading={loading}
    />
  )
}

export default CadastralReference
