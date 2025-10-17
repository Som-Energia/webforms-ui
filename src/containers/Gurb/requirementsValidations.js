import * as Yup from 'yup'

export const lightValidations = Yup.object().shape({
  has_light: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['light-on', 'light-off'])
})

export const addressValidations = Yup.object().shape({
  address: Yup.object().shape({
    street: Yup.string().required('NO_ADDRESS_STREET'),
    number: Yup.string().required('NO_ADDRESS_NUMBER'),
    lat: Yup.number().required('NO_ADDRESS_LAT'),
    long: Yup.number().required('NO_ADDRESS_LONG'),
    postal_code: Yup.string().required('NO_ADDRESS_POSTAL_CODE')
  })
})

export const selfConsumptionValidations = Yup.object().shape({
  has_selfconsumption: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['selfconsumption-on', 'selfconsumption-off'])
})

export const memberQuestionValidations = Yup.object().shape({  // TODO: review deprecation
  has_member: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['member-on', 'member-off', 'apadrinating'])
})
