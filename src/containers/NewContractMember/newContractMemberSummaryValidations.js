import * as Yup from 'yup'

const newContractMemberSummaryValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    privacy_policy_accepted: Yup.bool()
      .required('UNACCEPTED_TERMS')
      .oneOf([true], 'UNACCEPTED_TERMS'),
    generic_conditions_accepted: Yup.bool()
      .required('UNACCEPTED_TERMS')
      .oneOf([true], 'UNACCEPTED_TERMS'),
    statutes_accepted: Yup.bool()
      .required('UNACCEPTED_TERMS')
      .oneOf([true], 'UNACCEPTED_TERMS')
  })
})

export default newContractMemberSummaryValidations