import * as Yup from 'yup'

const newContractMemberSupplyPointValidations = Yup.object().shape({
  cups: Yup.string()
    .min(20, 'ERROR_FIELD_TOO_SHORT')
    .max(22, 'ERROR_FIELD_TOO_LONG')
    .required('ERROR_REQUIRED_FIELD'),
  has_light: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['light-on', 'light-off'])
});

export default newContractMemberSupplyPointValidations;