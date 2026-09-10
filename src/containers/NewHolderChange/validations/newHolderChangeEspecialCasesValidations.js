import * as Yup from "yup"

const requiredAttachments = Yup.array()
  .min(1, "ERROR_REQUIRED_FIELD")
  .required("ERROR_REQUIRED_FIELD")

const newHolderChangeEspecialCasesValidations = Yup.object().shape({
  especial_cases: Yup.string()
    .required("REQUIRED_FIELD")
    .oneOf([
      "reason_holder_change",
      "reason_death",
      "reason_merge",
      "reason_electrodep",
    ]),
  supply_point: Yup.object().when("especial_cases", (value, schema) => {
    switch (value) {
      case "reason_death":
        return schema.shape({
          attachments_reason_death: requiredAttachments,
        })

      case "reason_merge":
        return schema.shape({
          attachments_reason_merge: requiredAttachments,
        })

      case "reason_electrodep":
        return schema.shape({
          attachments_reason_electrodep: requiredAttachments,
          attachments_reason_electrodep_census: requiredAttachments,
        })

      default:
        return schema.notRequired()
    }
  }),
})

export default newHolderChangeEspecialCasesValidations
