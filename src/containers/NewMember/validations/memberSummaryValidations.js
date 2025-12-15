import * as Yup from 'yup'

const memberSummaryValidations = Yup.object().shape({
  privacy_policy_accepted: Yup.bool()
    .required('UNACCEPTED_TERMS')
    .oneOf([true], 'UNACCEPTED_TERMS'),
  statutes_accepted: Yup.bool()
    .required('UNACCEPTED_TERMS')
    .oneOf([true], 'UNACCEPTED_TERMS')
})

export default memberSummaryValidations
