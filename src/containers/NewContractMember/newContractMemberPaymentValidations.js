import * as Yup from 'yup'

const newContractMemberValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    iban: Yup.string().required('REQUIRED_FIELD'),
    iban_valid: Yup.bool().required('IBAN_ERROR').oneOf([true], 'IBAN_ERROR'),
    payment_method: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['iban', 'credit_card']),
    sepa_accepted: Yup.bool().required('IBAN_ERROR').oneOf([true], 'IBAN_ERROR')
  })
})

export default newContractMemberValidations