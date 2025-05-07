import * as Yup from 'yup'

const newContractMemberVoluntaryDonationValidations = Yup.object().shape({
  voluntary_donation: Yup.string()
    .required('REQUIRED_FIELD')
    .oneOf(['voluntary-donation-on', 'voluntary-donation-off'])
});

export default newContractMemberVoluntaryDonationValidations;