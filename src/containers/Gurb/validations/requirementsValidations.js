import * as Yup from "yup"

export const lightValidations = Yup.object().shape({
  has_light: Yup.string().required("REQUIRED_FIELD").oneOf(["light-on"]),
})

const addressFields = {
  street: Yup.string().required("GURB_NO_ADDRESS_STREET"),
  number: Yup.string().required("GURB_NO_ADDRESS_NUMBER"),
  lat: Yup.number().required("NO_ADDRESS_LAT"),
  long: Yup.number().required("NO_ADDRESS_LONG"),
  postal_code: Yup.string().required("GURB_NO_ADDRESS_POSTAL_CODE"),
}

export const addressFieldsValidations = Yup.object().shape({
  address: Yup.object().shape(addressFields),
})

export const addressValidations = Yup.object().shape({
  address: Yup.object().shape({
    ...addressFields,
    inside_perimeter: Yup.boolean()
      .required("REQUIRED_FIELD")
      .oneOf([true], "GURB_ADDRESS_OUT_OF_PERIMETER"),
  }),
})

export const selfConsumptionValidations = Yup.object().shape({
  has_selfconsumption: Yup.string()
    .required("REQUIRED_FIELD")
    .oneOf(["selfconsumption-off"]),
})

export const tariffValidations = Yup.object().shape({
  redirectUrl: Yup.string().required("REQUIRED_FIELD"),
})
