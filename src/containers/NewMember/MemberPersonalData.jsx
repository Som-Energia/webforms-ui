import LegalMemberPersonalData from './LegalMemberPersonalData'
import PhysicalMemberPersonalData from './PhysicalMemberPersonalData'

const MemberPersonalData = (props) => {
  const { values } = props

  return values?.new_member?.is_physical ? (
    <PhysicalMemberPersonalData {...props} />
  ) : (
    <LegalMemberPersonalData {...props} />
  )
}

export default MemberPersonalData
