import * as Yup from 'yup'


export const identifierValidations = Yup.object().shape({
  cups: Yup.string()
    .min(20, 'ERROR_FIELD_TOO_SHORT')
    .max(22, 'ERROR_FIELD_TOO_LONG')
    .required('ERROR_REQUIRED_FIELD'),
  new_contract: Yup.boolean()
    .required('CUPS_SHOULD_BE_ACTIVE')
    .oneOf([false], 'CUPS_SHOULD_BE_ACTIVE'),
})

export const gurbPowerOptions = Yup.object().shape({
  gurb: Yup.object().shape({
    power: Yup.string()
      .required()
  })
})

export const gurbPolicyChecks = Yup.object().shape({
  generic_especific_conditons_accepted: Yup.boolean().oneOf([true]).required(true),
  privacy_policy_accepted: Yup.boolean().oneOf([true]).required(true),
  tariff_payment_accepted: Yup.boolean().oneOf([true]).required(true),
  gurb_adhesion_payment_accepted: Yup.boolean().oneOf([true]).required(true),
})
