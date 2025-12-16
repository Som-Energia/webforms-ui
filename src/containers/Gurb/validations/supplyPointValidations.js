import * as Yup from 'yup'

const supplyPointValidations = Yup.object().shape({
  cups: Yup.string()
    .min(20, 'ERROR_FIELD_TOO_SHORT')
    .max(22, 'ERROR_FIELD_TOO_LONG')
    .required('ERROR_REQUIRED_FIELD')
})

export default supplyPointValidations
