import React from 'react'
import { checkCadastralReference } from '../services/api'
import MapIcon from '@mui/icons-material/Map'
import { useTranslation } from 'react-i18next'
import ApiValidatedField from './ApiValidatedField'

export function CadastralReferenceField(props) {
  const { t } = useTranslation()
  function inputFilter(value) {
    if (!value) return value
    value = value.replace(/[^0-9A-Za-z]/g, '') // TODO: Do not cut chars after not matching one
    value = value.slice(0, 20)
    value = value.toUpperCase()
    value = [
      value.slice(0, 7), // Finca/Parcela
      value.slice(7, 14), // Hoja
      value.slice(14, 18), // Local/Piso
      value.slice(18, 20), // Control
    ].join(' ').trim()
    return value
  }
  function localCheck(value) {
    return {
      value,
      valid: value.replaceAll(' ', '').length === 20,
      error: t('INVALID_REF_CADASTRAL_LENGTH'),
    }
  }
  function remoteCheck(value) {
    return checkCadastralReference(value)
      .then((response) => {
        const valid = response?.state === true
        return { value, valid, error: valid?undefined:t('INVALID_REF_CADASTRAL_CONTROL_DIGIT')}
      })
      .catch((error) => {
        const valid = !!error?.response?.data?.state
        return { value, valid, error: valid?undefined:t('INVALID_REF_CADASTRAL_CONTROL_DIGIT')}
      })
  }

  return (
    <ApiValidatedField
      {...props}
      leadingIcon={MapIcon}
      inputFilter={inputFilter}
      localCheck={localCheck}
      remoteCheck={remoteCheck}
    />
  )
}

export default CadastralReferenceField
