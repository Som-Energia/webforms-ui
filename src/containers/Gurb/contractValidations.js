import * as Yup from 'yup'

const contractValidations = Yup.object().shape({
  holder: Yup.object().shape({
    nif: Yup.string()
      .length(9, 'ERROR_FIELD_LENGTH')
      .required('ERROR_REQUIRED_FIELD'),
    has_holder: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['holder-same', 'holder-different'])
  })
})

export default contractValidations