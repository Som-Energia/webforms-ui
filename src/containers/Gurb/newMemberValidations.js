import * as Yup from 'yup'

export const newMemberValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    nif: Yup.string()
      .length(9, 'ERROR_FIELD_LENGTH')
      .required('ERROR_REQUIRED_FIELD'),
    name: Yup.string().required('ERROR_REQUIRED_FIELD'),
    surname1: Yup.string().required('ERROR_REQUIRED_FIELD'),
    surname2: Yup.string().required('ERROR_REQUIRED_FIELD'),
    email: Yup.string().required('ERROR_REQUIRED_FIELD').email('NO_EMAIL'),
    email2: Yup.string()
      .required('ERROR_REQUIRED_FIELD')
      .test('repeatEmail', 'NO_REPEATED_EMAIL', function () {
        return this.parent.email === this.parent.email2
      }), // To Do: is there a better way?
    phone1: Yup.string().length(9, 'NO_PHONE').required('ERROR_REQUIRED_FIELD'),
    phone2: Yup.string().length(9, 'NO_PHONE'),
    language: Yup.string().required('ERROR_REQUIRED_FIELD'),
    privacy_policy_accepted: Yup.bool()
      .required('UNACCEPTED_PRIVACY_POLICY')
      .oneOf([true], 'UNACCEPTED_PRIVACY_POLICY')
  })
})

export const apadrinatingValidations = Yup.object().shape({
  member: Yup.object().shape({
    has_member: Yup.string(),
    is_member: Yup.bool(),
    link_member: Yup.bool(),
    nif: Yup.string().required('ERROR_REQUIRED_FIELD'),
    number: Yup.number().required('ERROR_REQUIRED_FIELD')
  })
})

export const alreadyMemberValidations = Yup.object().shape({
  member: Yup.object().shape({
    has_member: Yup.string(),
    is_member: Yup.bool(),
    link_member: Yup.bool(),
    nif: Yup.string().required('ERROR_REQUIRED_FIELD'),
    number: Yup.number().required('ERROR_REQUIRED_FIELD')
  })
})

export default newMemberValidations
