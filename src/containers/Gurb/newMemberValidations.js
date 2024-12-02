import * as Yup from 'yup'

const newMemberValidations = Yup.object().shape({
  member: Yup.object().shape({
    dni: Yup.string()
      .length(9, 'ERROR_FIELD_LENGTH')
      .required('ERROR_REQUIRED_FIELD'),
    number: Yup.number().required('ERROR_REQUIRED_FIELD'),
    name: Yup.string().required('ERROR_REQUIRED_FIELD'),
    surname1: Yup.string().required('ERROR_REQUIRED_FIELD'),
    surname2: Yup.string().required('ERROR_REQUIRED_FIELD'),
    email: Yup.string().required('ERROR_REQUIRED_FIELD').email('NO_EMAIL'),
    email2: Yup.string()
      .required('ERROR_REQUIRED_FIELD')
      .test('repeatEmail', 'NO_REPEATED_EMAIL', function () {
        return this.parent.email === this.parent.email2
      }),
    phone1: Yup.string().min(9, 'NO_PHONE').required('ERROR_REQUIRED_FIELD'),
    phone2: Yup.string().min(9, 'NO_PHONE'),
    language: Yup.string().required('ERROR_REQUIRED_FIELD')
  })
})

export default newMemberValidations
