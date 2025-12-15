import * as Yup from 'yup'

const newContractMemberQuestionValidations = Yup.object().shape({
  has_member: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['member-on', 'member-off', 'member-link'])
});

export default newContractMemberQuestionValidations;