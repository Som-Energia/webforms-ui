import * as Yup from "yup"

const newHolderChangeSupplyPointValidations = Yup.object().shape({
  cups: Yup.string()
    .min(20, "ERROR_FIELD_TOO_SHORT")
    .max(22, "ERROR_FIELD_TOO_LONG")
    .required("ERROR_REQUIRED_FIELD"),
  cups_valid: Yup.boolean().oneOf([true], "ERROR_INVALID_FIELD"),
  social_tariff: Yup.boolean().oneOf([false], "ERROR_SOCIAL_TARIFF"),
  new_contract: Yup.boolean()
    .required("CUPS_SHOULD_BE_ACTIVE")
    .oneOf([false], "CUPS_SHOULD_BE_ACTIVE"),
  knowledge_of_distri: Yup.boolean().oneOf([true], "UNKNOWN_DISTRIBUTOR"),
  supply_point: Yup.object().shape({
    verified: Yup.bool()
      .required("MARK_ADDRESS_CONFIRMATION_BOX")
      .oneOf([true], "MARK_ADDRESS_CONFIRMATION_BOX"),
    supply_point_accepted: Yup.bool()
      .required("UNACCEPTED_FAIR_TITLE")
      .oneOf([true], "UNACCEPTED_FAIR_TITLE"),
  }),
})

export default newHolderChangeSupplyPointValidations
