import * as Yup from "yup"

const newHolderChangeVoluntaryDonationValidations = Yup.object().shape({
  voluntary_donation: Yup.bool()
    .required("REQUIRED_FIELD")
    .oneOf([true, false]),
})

export default newHolderChangeVoluntaryDonationValidations
