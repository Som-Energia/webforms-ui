import * as Yup from 'yup'

const addressValidations = Yup.object().shape({
    street: Yup.string().required('NO_ADDRESS'),
    postal_code: Yup.string().matches(/^[0-9]+$/, 'POSTAL_CODE_INVALID_FORMAT').length(5, 'POSTAL_CODE_INVALID_LENGTH').required('NO_POSTAL_CODE'),
    state: Yup.object().shape({
        id: Yup.number().min(1).required('POSTAL_CODE_INVALID'),
        name: Yup.string()
    }),
    number: Yup.number().required('NO_NUMBER')
})

export default addressValidations
