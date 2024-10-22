import React, { useEffect } from 'react'
import { checkCups } from '../services/api'
import SolarPowerIcon from '@mui/icons-material/WbSunny'
import { useTranslation } from 'react-i18next'
import ApiValidatedField from './ApiValidatedField'
import { checkCAUWhileTyping } from '../services/utils'

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
      value.slice(6, 10), // Supply point
      value.slice(10, 14), // Supply point
      value.slice(14, 18), // Supply point
      value.slice(18, 20), // Control
      value.slice(20, 22), // Border point
      value.slice(22, 26), // CAU
    ].join(' ').trim()
    return value
  }

  function localCheck(value) {
    return checkCAUWhileTyping(value, t, props.cupsToMatch)
  }
  function remoteCheck(value) {
    return checkCups(value.replace(/ /g, '').slice(0, 20))
      .then((response) => {
        const valid = response?.state === true
        return { value, valid, error: valid ? undefined : t("CAU_INVALID_CONTROL_DIGIT") }
      })
      .catch((error) => {
        const valid = !!error?.response?.data?.state
        return { value, valid, error: valid ? undefined : t("CAU_INVALID_CONTROL_DIGIT") }
      })
  }

  useEffect(() => {
    if (props.value) {
      const result = localCheck(props.value)
      props.onChange({ ...result, valid: false })
    }
  }, [props.cupsToMatch])

  return (
    <ApiValidatedField
      {...props}
      leadingIcon={SolarPowerIcon}
      inputFilter={inputFilter}
      localCheck={localCheck}
      remoteCheck={remoteCheck}
    />
  )
}

export default CAUField
