import React from 'react'
import { checkCups } from '../services/api'
import SolarPowerIcon from '@mui/icons-material/WbSunny'
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
    const compact = value.replaceAll(' ', '')
    const borderPoint = compact.slice(20,22)
    const installation = compact.slice(22,26)
    const collective_installation = props.data.collective_installation
    const cups = props.data.cups.slice(0,20)
    if (collective_installation == false){
      const cau_cups = compact.slice(0,20)
      if (cau_cups != cups) return {value, valid: false, error:t("CAU_INVALID_CUPS")}
    }
    if (!compact) return {value, valid: false}
    if (compact.slice(0,2) !== "ES".slice(0,compact.length)) return {value, valid: false, error:t("CAU_INVALID_PREFIX")}
    if (borderPoint.length === 2 && !/^\d[A-Z]$/.test(borderPoint)) return {value, valid: false, error:t("CAU_INVALID_BORDER_POINT")}
    if (installation.length === 4 && !/^A\d{1,3}$/.test(installation)) return {value, valid: false, error:t("CAU_INVALID_INSTALLATION")}
    if (compact.length !== 26) return {value, valid: false, error:t("CAU_INVALID_LENGTH")}
    return {value, valid: true}
  }
  function remoteCheck(value) {
    return checkCups(value.replace(/ /g, '').slice(0,20))
      .then((response) => {
        const valid = response?.state === true
        return { value, valid, error: valid?undefined:t("CAU_INVALID_CONTROL_DIGIT") }
      })
      .catch((error) => {
        const valid = !!error?.response?.data?.state
        return { value, valid, error: valid?undefined:t("CAU_INVALID_CONTROL_DIGIT")  }
      })
  }

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
