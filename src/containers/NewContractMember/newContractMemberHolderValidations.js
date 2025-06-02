import * as Yup from 'yup'

const newContractMemberHolderValidations = Yup.object().shape({
  previous_holder: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['previous-holder-yes', 'previous-holder-no']),
  member_is_holder: Yup.string().when('has-member', {
    is: 'member-on',
    then: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['member-holder-yes', 'member-holder-no'])
  })
})

export default newContractMemberHolderValidations
