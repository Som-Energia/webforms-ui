import * as Yup from "yup"

const newHolderChangeEspecialCasesValidations = Yup.object().shape({
  especial_cases: Yup.string()
    .required("REQUIRED_FIELD")
    .oneOf([
      "reason_holder_change",
      "reason_death",
      "reason_merge",
      "reason_electrodep",
    ]),
})

export default newHolderChangeEspecialCasesValidations
