import { checkVatFormat } from '../services/utils'

export const handleInputNif = (event, setFieldValue, fieldName) => {
  let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
  value = value[0].toUpperCase()
  setFieldValue(fieldName, value)
}

export const handleCheckNifFormat = async (nif, setFieldError, fieldName) => {
  let valid = checkVatFormat(nif)
  if (valid === true) {
    setFieldError(fieldName, undefined)
  } else {
    setFieldError(fieldName, 'INVALID_NIF')
  }
}

export const handleChangeInteger = (event, setFieldValue) => {
  let cleanedValue = event.target.value.replace(/[^0-9]/g, '')
  setFieldValue(event.target.name, cleanedValue)
}

// TODO: generalize?
export const handleInputNifBlur = (setFieldTouched, fieldName) => {
  setFieldTouched(fieldName, true)
}
export const handleChange = (event, setFieldValue) => {
  setFieldValue(event.target.name, event.target.value)
}
