import { checkVatFormat } from "../services/utils"

export const handleInputNif = (event, setFieldValue, fieldName) => {
  let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
  value = value[0].toUpperCase()
  setFieldValue(fieldName, value)
}

export const handleInputNifBlur = (setFieldTouched, fieldName) => {
  setFieldTouched(fieldName, true)
}

export const handleCheckNifFormat = async (nif, setFieldError, fieldName) => {
    let valid = checkVatFormat(nif)
    if (valid === true) {
      setFieldError(fieldName, undefined)
    } else {
      setFieldError(fieldName, 'INVALID_NIF')
    }
  }