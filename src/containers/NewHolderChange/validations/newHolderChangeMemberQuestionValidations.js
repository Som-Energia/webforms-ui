import * as Yup from "yup"

const newHolderChangeMemberQuestionValidations = Yup.object().shape({
  has_member: Yup.string()
    .required("REQUIRED_FIELD")
    .oneOf(["member-on", "member-off", "member-link", "without-member"]),
})

export default newHolderChangeMemberQuestionValidations
