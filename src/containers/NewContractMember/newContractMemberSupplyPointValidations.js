import * as Yup from 'yup'

const newContractMemberSupplyPointValidations = Yup.object().shape({
  cups: Yup.string()
    .min(20, 'ERROR_FIELD_TOO_SHORT')
    .max(22, 'ERROR_FIELD_TOO_LONG')
    .required('ERROR_REQUIRED_FIELD'),
  new_contract: Yup.boolean()
    .oneOf([true], 'CUPS_IN_PROCESS'),
  knowledge_of_distri: Yup.boolean()
    .oneOf([true], 'UNKNOWN_DISTRI'),
  has_light: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['light-on', 'light-off'])
});

export default newContractMemberSupplyPointValidations;