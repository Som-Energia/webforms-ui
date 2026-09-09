import * as Yup from "yup"

const holderIdentifierValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    nif: Yup.string()
      .required("ERROR_REQUIRED_FIELD")
      .matches(/(^[A-GI-Z0-9])/, "CIF_COMMUNITY_OWNERS")
      .matches(
        /^([0-9]{8}[A-Z])|([A-Z][0-9]{7}[A-Z])|([A-Z][0-9]{8})$/,
        "INVALID_NIF",
      ),
  }),
  member: Yup.object().when("has_member", {
    is: (value) => ["member-link", "member-on"].includes(value),
    then: (schema) =>
      schema.shape({
        nif: Yup.string()
          .required("ERROR_REQUIRED_FIELD")
          .matches(/^[A-GI-Z0-9]/, "CIF_COMMUNITY_OWNERS")
          .matches(
            /^([0-9]{8}[A-Z])|([A-Z][0-9]{7}[A-Z])|([A-Z][0-9]{8})$/,
            "INVALID_NIF",
          ),
        number: Yup.string()
          .required("ERROR_REQUIRED_FIELD")
          .matches(/^[0-9]+$/, "INVALID_NUMBER"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
})

export default holderIdentifierValidations
