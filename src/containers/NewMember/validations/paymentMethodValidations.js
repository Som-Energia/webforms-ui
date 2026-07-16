import * as Yup from 'yup'

const memberPaymentMethodValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    payment_method: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['iban', 'credit_card']),
    iban: Yup.string().when('payment_method', {
      is: 'iban',
      then: Yup.string().required('IBAN_ERROR')
    }),
    iban_valid: Yup.bool().when('payment_method', {
      is: 'iban',
      then: Yup.bool().required('IBAN_ERROR').oneOf([true], 'IBAN_ERROR')
    }),
    sepa_accepted: Yup.bool().when('payment_method', {
      is: 'iban',
      then: Yup.bool().required('IBAN_ERROR').oneOf([true], 'IBAN_ERROR')
    }),
    payment_authorization_accepted: Yup.bool().when('payment_method', {
      is: 'credit_card',
      then: Yup.bool()
        .required('UNACCEPTED_PAYMENT_AUTHORIZATION')
        .oneOf([true], 'UNACCEPTED_PAYMENT_AUTHORIZATION')
    })
  })
})

export default memberPaymentMethodValidations
