import * as Yup from "yup"

import { checkVatFormat } from "../../../services/utils"

const holderIdentifierValidations = Yup.object().shape({
  new_member: Yup.object().when("has_member", {
    is: (value) => ["member-off", "without-member"].includes(value),
    then: (schema) =>
      schema.shape({
        nif: Yup.string()
          .required("ERROR_REQUIRED_FIELD")
          .test("valid-nif", "INVALID_NIF", function (value) {
            if (!value) return true
            return checkVatFormat(value)
          }),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  member: Yup.object().when("has_member", {
    is: (value) => ["member-link", "member-on"].includes(value),
    then: (schema) =>
      schema.shape({
        nif: Yup.string()
          .required("ERROR_REQUIRED_FIELD")
          .test("valid-nif", "INVALID_NIF", function (value) {
            if (!value) return true
            return checkVatFormat(value)
          }),
        number: Yup.string()
          .required("ERROR_REQUIRED_FIELD")
          .matches(/^[0-9]+$/, "INVALID_NUMBER"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
})

export default holderIdentifierValidations
