import { checkVatFormat } from '../services/utils'

export const handleCheckNifFormat = async (nif, setFieldError, fieldName) => {
  let valid = checkVatFormat(nif)
  if (valid === true) {
    setFieldError(fieldName, undefined)
  } else {
    setFieldError(fieldName, 'INVALID_NIF')
  }
}
