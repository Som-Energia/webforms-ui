import * as Yup from 'yup'

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