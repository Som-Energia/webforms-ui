import * as Yup from 'yup'

const newContractHolderValidations = Yup.object().shape({
  previous_holder: Yup.string().when('has_light', {
    is: 'light-on',
    then: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['previous-holder-yes', 'previous-holder-no'])
  })
})

export default newContractHolderValidations
