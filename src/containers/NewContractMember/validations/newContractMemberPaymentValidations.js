import * as Yup from 'yup'

const newContractMemberValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    iban: Yup.string().when('payment_method', {
      is: 'iban',
      then: Yup.string().required('REQUIRED_FIELD'),
      otherwise: Yup.string().notRequired()
    }),
    iban_valid: Yup.bool().when('payment_method', {
      is: 'iban',
      then: Yup.bool().required('IBAN_ERROR').oneOf([true], 'IBAN_ERROR'),
      otherwise: Yup.bool().notRequired()
    }),
    payment_method: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['iban', 'credit_card']),
    sepa_accepted: Yup.bool().when('payment_method', {
      is: 'iban',
      then: Yup.bool().required('UNACCEPTED_PAYMENT_TITLE').oneOf([true], 'UNACCEPTED_PAYMENT_TITLE'),
      otherwise: Yup.bool().notRequired()
    })
  })
})

export default newContractMemberValidations
