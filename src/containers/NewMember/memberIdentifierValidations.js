import * as Yup from 'yup'

const memberIdentifierValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    nif: Yup.string()
      .required('ERROR_REQUIRED_FIELD')
      .matches(/(^[A-GI-Z0-9])/, 'CIF_COMMUNITY_OWNERS')
      .matches(/^[0-9A-Z][0-9]{7}[0-9A-Z]\d*$/, 'INVALID_NIF')
  })
})

export default memberIdentifierValidations