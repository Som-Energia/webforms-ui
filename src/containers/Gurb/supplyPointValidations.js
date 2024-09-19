import * as Yup from 'yup'

const supplyPointValidations = Yup.object().shape({
  cups: Yup.string()
    // .matches(/^ES[0-9]{15}\d*$/, 'INVALID_FIELD')
    .min(18, 'TOO_SHORT')
    .max(20, 'TOO_LONG')
    .required('REQUIRED_FIELD')
})

export default supplyPointValidations
