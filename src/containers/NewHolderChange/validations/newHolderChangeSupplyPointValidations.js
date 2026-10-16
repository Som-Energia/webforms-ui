import * as Yup from "yup"

const newHolderChangeSupplyPointValidations = Yup.object().shape({
  cups_valid: Yup.boolean().oneOf([true], "ERROR_INVALID_FIELD"),
  social_tariff: Yup.boolean().oneOf([false], "ERROR_SOCIAL_TARIFF"),
  cups: Yup.string()
    .required("CUPS_INVALID")
    .min(20, "ERROR_FIELD_TOO_SHORT")
    .max(22, "ERROR_FIELD_TOO_LONG")
    .test("statusError", "CUPS_INVALID", function () {
      return !(this.parent.status === "error")
    })
    .test("statusBusy", "CUPS_IN_PROCESS", function () {
      return !(this.parent.status === "busy")
    })
    .test("statusNew", "CUPS_SHOULD_BE_ACTIVE", function () {
      return !(this.parent.status === "new")
    })
    .test("statusInactive", "CUPS_SHOULD_BE_ACTIVE", function () {
      return !(this.parent.status === "inactive")
    })
    .test("statusInvalid", "INVALID_SUPPLY_POINT_CUPS", function () {
      return !(this.parent.status === "invalid")
    }),
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
