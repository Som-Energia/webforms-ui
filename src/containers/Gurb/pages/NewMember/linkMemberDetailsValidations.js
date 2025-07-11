import * as Yup from 'yup'

const linkMemberValidations = Yup.object().shape({
  member: Yup.object().shape({
    nif: Yup.string()
      .required('ERROR_REQUIRED_FIELD')
      .matches(/(^[A-GI-Z0-9])/, 'CIF_COMMUNITY_OWNERS')
      .matches(/^([0-9]{8}[A-Z])|([A-Z][0-9]{7}[A-Z])|([A-Z][0-9]{8})$/, 'INVALID_NIF'),
    number: Yup.string()
      .required('ERROR_REQUIRED_FIELD')
      .matches(/(^[0-9])/, 'INVALID_NUMBER')
  })
})

export default linkMemberValidations