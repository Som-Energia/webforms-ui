import * as Yup from 'yup'


export const identifierValidations = Yup.object().shape({
  member: Yup.object().shape({  // TODO: Don't repeat code 👀
    nif: Yup.string()
      .required('ERROR_REQUIRED_FIELD')
      .matches(/(^[A-GI-Z0-9])/, 'CIF_COMMUNITY_OWNERS')
      .matches(/^([0-9]{8}[A-Z])|([A-Z][0-9]{7}[A-Z])|([A-Z][0-9]{8})$/, 'INVALID_NIF'),
    number: Yup.string()
      .required('ERROR_REQUIRED_FIELD')
      .matches(/(^[0-9]+$)/, 'INVALID_NUMBER')
  }),
  cups: Yup.string()
    .min(20, 'ERROR_FIELD_TOO_SHORT')
    .max(22, 'ERROR_FIELD_TOO_LONG')
    .required('ERROR_REQUIRED_FIELD'),
  new_contract: Yup.boolean()
    .required('CUPS_SHOULD_BE_ACTIVE')
    .oneOf([false], 'CUPS_SHOULD_BE_ACTIVE'),
})

export const gurbPowerOptions = Yup.object().shape({
    contract: Yup.object().shape({
        gurb_power: Yup.string()
            .oneOf(["1 KWh", "0.5 KWh"])
            .required()
    })
})

export const gurbPolicyChecks = Yup.object().shape({
    generic_especific_conditons_accepted: Yup.boolean().oneOf([true]).required(true),
    privacy_policy_accepted: Yup.boolean().oneOf([true]).required(true),
    tariff_payment_accepted: Yup.boolean().oneOf([true]).required(true),
    gurb_adhesion_payment_accepted: Yup.boolean().oneOf([true]).required(true),
})
