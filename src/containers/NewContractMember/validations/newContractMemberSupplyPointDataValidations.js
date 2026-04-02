import * as Yup from 'yup'
import addressValidations from './addressValidations';

const newContractMemberSupplyPointDataValidations = Yup.object().shape({
  cadastral_reference: Yup.string().length(23, 'INVALID_REF_CADASTRAL_LENGTH'),
  cadastral_reference_valid: Yup.bool()
  .required('CADASTRAL_REFERENCE_ERROR')
  .oneOf([true], 'CADASTRAL_REFERENCE_ERROR'),
  supply_point: Yup.object().shape({
    cnae: Yup.string().required('REQUIRED_CNAE'),
    cnae_valid: Yup.bool()
      .required('INCORRECT_CNAE')
      .oneOf([true], 'INCORRECT_CNAE'),
    supply_point_accepted: Yup.bool()
      .required('UNACCEPTED_FAIR_TITLE')
      .oneOf([true], 'UNACCEPTED_FAIR_TITLE'),
  }),
  supply_point_address: addressValidations

});

export default newContractMemberSupplyPointDataValidations;
