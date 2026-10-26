import { Grid2 as Grid } from "@mui/material"

import NifCif from "../../../components/NifCif/NifCif"
import LinkMemberDetails from "../../NewContractMember/pages/LinkMemberDetails"
import MemberIdentifier from "../../NewMember/pages/MemberIdentifier"

const HolderIdentifier = (props) => {
  const { values } = props

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        {values?.has_member === "member-off" ? (
          <MemberIdentifier {...props} title={false} entity="new_member" />
        ) : values?.has_member === "member-on" ||
          values?.has_member === "member-link" ? (
          <LinkMemberDetails {...props} title={false} />
        ) : values?.has_member === "without-member" ? (
          <NifCif entity="new_member" {...props} />
        ) : null}
      </Grid>
    </Grid>
  )
}

export default HolderIdentifier
