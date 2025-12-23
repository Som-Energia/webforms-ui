import React, { useState, useEffect } from 'react'
import { checkCups } from '../services/api'
import { useTranslation } from 'react-i18next'
import InputField from './InputField'
import { isMatchingCUPSandCAU, prettyCAU } from '../services/utils'

export function CAUField({
  name,
  id,
  label,
  variant,
  values,
  value,
  onBlur,
  touched,
  error,
  required,
  setFieldValue,
  helperText
}) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const handleChange = async (event) => {
    const cau = prettyCAU(event.target.value)
    setFieldValue('self_consumption.cau', cau)
  }

  useEffect(() => {
    isLoading && setIsLoading(false)
  }, [values.self_consumption.cau_valid])

  useEffect(() => {
    setFieldValue('self_consumption.cau_valid', isValid)
  }, [isValid])

  useEffect(() => {
    const cleaned_cau = (values?.self_consumption?.cau ?? '').replace(/ /g, '')

    if (values?.self_consumption?.collective_installation == 'individual') {
      setIsValid(isMatchingCUPSandCAU(cleaned_cau, values?.cups))
    } else if (cleaned_cau.length == 26) {
      setIsLoading(true)
      checkCups(cleaned_cau.slice(0, 20))
        .then((response) => {
          setIsValid(response?.state === true)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setIsValid(false)
          setIsLoading(false)
        })
    } else {
      setIsValid(false)
    }
  }, [
    values.self_consumption.cau,
    values.self_consumption.collective_installation
  ])

  return (
    <InputField
      id={id}
      name={name}
      textFieldName={label}
      variant={variant}
      required={required}
      value={value}
      handleChange={handleChange}
      handleBlur={onBlur}
      touched={touched}
      error={!isLoading ? error : ''}
      textFieldHelper={
        isLoading ? t('API_VALIDATED_FIELD_CHECKING') : helperText
      }
    />
  )
}

export default CAUField
