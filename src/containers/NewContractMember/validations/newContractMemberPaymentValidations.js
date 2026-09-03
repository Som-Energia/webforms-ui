import * as Yup from "yup"

import { creditCardPaymentEnabled } from "../paymentMethods"

const newContractMemberValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    iban: Yup.string().when("payment_method", {
      is: "iban",
      then: Yup.string().required("REQUIRED_FIELD"),
      otherwise: Yup.string().notRequired(),
    }),
    iban_valid: Yup.bool().when(["payment_method","iban"], {
      is: (paymentMethod, iban) => {
        return paymentMethod === "iban" && Boolean(iban)
      },
      then: Yup.bool().oneOf([true], "IBAN_ERROR"),
      otherwise: Yup.bool().notRequired(),
    }),
    payment_method: Yup.string()
      .required("REQUIRED_FIELD")
      .oneOf(creditCardPaymentEnabled ? ["iban", "credit_card"] : ["iban"]),
    sepa_accepted: Yup.bool().when("payment_method", {
      is: "iban",
      then: Yup.bool()
        .required("REQUIRED_FIELD")
        .oneOf([true], "REQUIRED_FIELD"),
      otherwise: Yup.bool().notRequired(),
    }),
    payment_authorization_accepted: Yup.bool().when("payment_method", {
      is: "credit_card",
      then: Yup.bool()
        .required("REQUIRED_FIELD")
        .oneOf([true], "REQUIRED_FIELD"),
      otherwise: Yup.bool().notRequired(),
    }),
  }),
})

export default newContractMemberValidations
