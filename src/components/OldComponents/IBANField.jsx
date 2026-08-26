import React from "react"

import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined"

import { checkIbanFormat } from "../../services/utils"
import ApiValidatedField from "./ApiValidatedField"

export function IBANField(props) {
  const { onChange, ...others } = props
  function inputFilter(value) {
    if (!value) return value
    value = value.replace(/[^0-9A-Za-z]/g, "")
    value = value.slice(0, 24)
    value = value.toUpperCase()
    value = value.split(" ").join("")
    value = value.match(/.{1,4}/g).join(" ")
    return value
  }
  function localCheck(value) {
    const valid = checkIbanFormat(value)
    return { value, valid }
  }
  return (
    <ApiValidatedField
      {...others}
      leadingIcon={AccountBalanceOutlinedIcon}
      inputFilter={inputFilter}
      localCheck={localCheck}
      onChange={(newValue) => {
        return onChange({
          ...newValue,
          IBAN: newValue.value,
          IBANValid: newValue.valid,
        })
      }}
    />
  )
}

export default IBANField
