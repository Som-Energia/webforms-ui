import * as Yup from 'yup'

const newContractMemberSelfConsumptionDataValidations = Yup.object().shape({
    collective_installatio: Yup.string()
        .required('REQUIRED_FIELD')
        .oneOf(['individual', 'collective'])
})

export default newContractMemberSelfConsumptionDataValidations