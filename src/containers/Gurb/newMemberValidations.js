import * as Yup from 'yup'

const newMemberValidations = Yup.object().shape({
  member: Yup.object().shape({
    dni: Yup.string()
      .length(9, 'ERROR_FIELD_LENGTH')
      .required('ERROR_REQUIRED_FIELD'),
    number: Yup.number().required('ERROR_REQUIRED_FIELD')
  })
})

export default newMemberValidations
