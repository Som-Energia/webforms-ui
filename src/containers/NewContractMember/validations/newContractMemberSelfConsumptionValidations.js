import * as Yup from 'yup'

const newContractMemberSelfConsumptionValidations = Yup.object().shape({
    has_selfconsumption: Yup.string()
        .required('REQUIRED_FIELD')
        .oneOf(['selfconsumption-on', 'selfconsumption-off'])
})

export default newContractMemberSelfConsumptionValidations