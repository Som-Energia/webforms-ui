import * as Yup from 'yup'

const newContractMemberHolderValidations = Yup.object().shape({
  previous_holder: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['previous-holder-yes', 'previous-holder-no'])
});

export default newContractMemberHolderValidations;