import { useTranslation } from "react-i18next"

import { Grid2 as Grid } from "@mui/material"
import Typography from "@mui/material/Typography"

import NifCif from "../../../components/NifCif/NifCif"
import LinkMemberDetails from "../../NewContractMember/pages/LinkMemberDetails"
import MemberIdentifier from "../../NewMember/pages/MemberIdentifier"

const HolderIdentifier = (props) => {
  const { values } = props
  const { t } = useTranslation()

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t("HOLDER_PAGE_NIF")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {values?.has_member === "member-off" ? (
          <MemberIdentifier {...props} title={false} entity="new_member" />
        ) : values?.has_member === "member-on" ? (
          <LinkMemberDetails {...props} title={false} entity="new_member" />
        ) : values?.has_member === "no-member" ? (
          <NifCif entity="new_member" {...props} holder={true} />
        ) : (
          <>
            <NifCif entity="new_member" {...props} holder={true} />
            <LinkMemberDetails {...props} title={false} entity="new_member" />
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default HolderIdentifier
