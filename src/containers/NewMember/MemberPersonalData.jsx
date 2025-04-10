import LegalMemberPersonalData from './LegalMemberPersonalData'
import PhysicalMemberPersonalData from './PhysicalMemberPersonalData'

const MemberPersonalData = (props) => {
  const { values } = props

  return values?.new_member?.person_type == 'physic-person' ? (
    <PhysicalMemberPersonalData {...props} />
  ) : (
    <LegalMemberPersonalData {...props} />
  )
}

export default MemberPersonalData
