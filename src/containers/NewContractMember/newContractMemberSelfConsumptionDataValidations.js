import * as Yup from 'yup'

const newContractMemberSelfConsumptionDataValidations = Yup.object().shape({
    self_consumption: Yup.object().shape({
        cau: Yup.string()
            .min(26, 'CAU_INVALID_LENGTH')
            .max(26, 'CAU_INVALID_LENGTH')
            .required('ERROR_REQUIRED_FIELD'),
        cau_valid: Yup.bool().when('collective_installation', {
            is: 'individual',
            then: Yup.bool().oneOf([true], 'CAU_NOT_MATCHING_CUPS'),
            otherwise: Yup.bool().oneOf([true], 'ERROR_INVALID_FIELD'),
        }),
        collective_installation: Yup.string()
            .required('FILL_SELFCONSUMPTION_COLLECTIVE_INSTALLATION')
            .oneOf(['individual', 'collective']),
        installation_power: Yup.number()
            .required('FILL_SELFCONSUMPTION_INSTALLATION_POWER')
            .max(100, 'INSTALLATION_POWER_EXCEDED'),
        installation_type: Yup.string().required(
            'FILL_SELFCONSUMPTION_INSTALLATION_SITUATION'
        ),
        technology: Yup.string().required('FILL_SELFCONSUMPTION_TECHNOLOGY'),
        aux_services: Yup.string()
            .required('FILL_SELFCONSUMPTION_AUX_SERVICES')
            .oneOf(['auxiliary-service-yes', 'auxiliary-service-no']),
    })
})

export default newContractMemberSelfConsumptionDataValidations