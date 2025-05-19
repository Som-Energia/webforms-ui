import * as Yup from 'yup'

const newContractMemberSelfConsumptionDataValidations = Yup.object().shape({
    self_consumption: Yup.object().shape({
        cau: Yup.string().when('cau_error', (cau_error) => {
            if (cau_error)
                return Yup.mixed().test({
                name: 'cau_error',
                test: () => false,
                message: cau_error
                })
            return Yup.string().required('FILL_SELFCONSUMPTION_CAU')
        }),
        cau_error: Yup.mixed().oneOf([Yup.bool(), Yup.string()]),
        collective_installation: Yup.string()
            .required('FILL_SELFCONSUMPTION_COLLECTIVE_INSTALLATION')
            .oneOf(['individual', 'collective']),
        installation_power: Yup.number().required(
            'FILL_SELFCONSUMPTION_INSTALLATION_POWER'
        ),
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