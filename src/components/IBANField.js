import React from 'react'
import { checkIban } from '../services/api'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import { useTranslation } from 'react-i18next'
import ApiValidatedField from './ApiValidatedField'

export function IBANField(props) {
  const { t } = useTranslation()
  const { onChange, ...others } = props
  function inputFilter(value) {
    if (!value) return value
    value = value.replace(/[^0-9A-Za-z]/g, '') // TODO: Do not cut chars after not matching one
    value = value.slice(0, 24)
    value = value.toUpperCase()
    value = value.split(' ').join('')
    value = value.match(/.{1,4}/g).join(' ')
    return value
  }
  function localCheck(value) {
    return { value, valid: value.replaceAll(' ', '').length === 24 }
  }
  function remoteCheck(value) {
    return checkIban(value)
      .then((response) => {
        const valid = response?.state === true
        return { value, valid }
      })
      .catch((error) => {
        const valid = !!error?.response?.data?.state
        return { value, valid }
      })
  }

  return (
    <ApiValidatedField
      {...others}
      leadingIcon={AccountBalanceOutlinedIcon}
      inputFilter={inputFilter}
      localCheck={localCheck}
      remoteCheck={remoteCheck}
      onChange={(newValue) => {
        return onChange({
          ...newValue,
          // TODO: deprecated API, remove when unused
          IBAN: newValue.value,
          IBANValid: newValue.valid,
        })
      }}
    />
  )
}

export default IBANField
