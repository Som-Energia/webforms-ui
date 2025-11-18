import * as Yup from 'yup'

const newContractMemberHolderValidations = Yup.object().shape({
  member_is_holder: Yup.string().when('has_member', {
    is: 'member-on' || 'member-link',
    then: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['holder-member-yes', 'holder-member-no'])
  })
})

export default newContractMemberHolderValidations
