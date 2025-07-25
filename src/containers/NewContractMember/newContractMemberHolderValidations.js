import * as Yup from 'yup'

const newContractMemberHolderValidations = Yup.object().shape({
  previous_holder: Yup.string().when('has_light', {
    is: 'light-on',
    then: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['previous-holder-yes', 'previous-holder-no'])
  }),
  member_is_holder: Yup.string().when('has_member', {
    is: 'member-on',
    then: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['holder-member-yes', 'holder-member-no'])
  })
})

export default newContractMemberHolderValidations
