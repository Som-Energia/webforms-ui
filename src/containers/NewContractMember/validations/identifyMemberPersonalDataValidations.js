import * as Yup from 'yup'

const identifyMemberPersonalDataValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    nif: Yup.string()
    .required('ERROR_REQUIRED_FIELD')
    .matches(/^[0-9A-Z][0-9]{7}[0-9A-Z]\d*$/, 'INVALID_NIF'),
    person_type: Yup.string().oneOf(['legal-person', 'physic-person']),
    name: Yup.string().required('NO_NAME'),
    surname1: Yup.string().when('person_type', {
      is: 'physic-person',
      then: Yup.string().required('NO_SURNAME1')
    }),
    surname2: Yup.string(),
    email: Yup.string().required('NO_EMAIL').email('NO_EMAIL'),
    email2: Yup.string().test('repeatEmail', 'NO_REPEATED_EMAIL', function () {
      return this.parent.email === this.parent.email2
    }),
    phone: Yup.string().required('NO_PHONE'),
    phone_code: Yup.string().required('NO_PHONE'),
    phone_valid: Yup.bool()
      .required('NO_PHONE')
      .oneOf([true], 'INCORRECT_PHONE'),
    language: Yup.string().required('NO_LANGUAGE'),
    proxyname: Yup.string().when('person_type', {
      is: 'legal-person',
      then: Yup.string().required('NO_PROXY_NAME')
    }),
    proxynif: Yup.string().when('person_type', {
      is: 'legal-person',
      then: Yup.string().required('NO_PROXY_NIF')
    }),
    legal_person_accepted: Yup.bool().when(
      'person_type',
      (person_type, schema) => {
        return person_type == 'legal-person'
          ? schema
              .required('ACCEPT_LEGAL_PERSON')
              .oneOf([true], 'ACCEPT_LEGAL_PERSON')
          : schema
      }
    )
  }),
  address: Yup.object().shape({
    street: Yup.string().required('NO_ADDRESS'),
    number: Yup.number().required('NO_NUMBER')
  })
})

export default identifyMemberPersonalDataValidations
