import * as Yup from 'yup'

const memberSummaryValidations = Yup.object().shape({
  new_member: Yup.object().shape({
    terms_accepted: Yup.bool()
      .required('UNACCEPTED_TERMS')
      .oneOf([true], 'UNACCEPTED_TERMS')
  })
})

export default memberSummaryValidations