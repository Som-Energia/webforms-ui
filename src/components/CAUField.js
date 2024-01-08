import React from 'react'
import { checkCups } from '../services/api'
import MapIcon from '@material-ui/icons/Map'
import { useTranslation } from 'react-i18next'
import ApiValidatedField from './ApiValidatedField'

export function CAUField(props) {
  const { t } = useTranslation()
  function inputFilter(value) {
    if (!value) return value
    value = value.replace(/[^0-9A-Za-z]/g, '') // TODO: Do not cut chars after not matching one
    value = value.slice(0, 26)
    value = value.toUpperCase()
    value = [
      value.slice(0, 2), // ES
      value.slice(2, 6), // Supplier
      value.slice(6, 18), // Supply point
      value.slice(18, 20), // Control
      value.slice(20, 22), // Border point
      value.slice(22, 26), // CAU
    ].join(' ').trim()
    return value
  }
  function localCheck(value) {
    return value.replaceAll(' ', '').length === 26
  }
  function remoteCheck(value) {
    return checkCups(value.replace(/ /g, '').slice(0,20))
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
      {...props}
      leadingIcon={MapIcon}
      inputFilter={inputFilter}
      localCheck={localCheck}
      remoteCheck={remoteCheck}
    />
  )
}

export default CAUField
