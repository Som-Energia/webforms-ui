import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Grid2 as Grid } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import AlertBox from "../../../components/AlertBox/AlertBox"
import CUPS from "../../../components/Cups/CUPS"
import InputField from "../../../components/InputField/InputField"
import TermsDialog from "../../../components/TermsDialog"

const NewHolderChangeSupplyPoint = ({ ...props }) => {
  const trackID = "supply-point"

  const { values, setFieldValue, sendTrackEvent } = props
  const { t } = useTranslation()

  useEffect(() => {
    sendTrackEvent(trackID)
  }, [])
  const theme = useTheme()

  const [open, setOpen] = useState(false)

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue("supply_point.supply_point_accepted", true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue("supply_point.supply_point_accepted", false)
  }

  const handleClickVerified = (event) => {
    event.preventDefault()
    setFieldValue("supply_point.verified", !values?.supply_point?.verified)
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <AlertBox
          id="percent_value_error"
          description={t("RECOMMENDATION_SUBTITLE")}
          severity={"warning"}
          variant={"body.md.regular"}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="headline4.regular" mb={2}>
          {t("CUPS_TITLE")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CUPS {...props} />
      </Grid>
      <Grid item xs={12}>
        <InputField
          name="address"
          textFieldName={t("ADDRESS")}
          value={values?.supply_point_address}
          readonlyField
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="supply_point_accepted"
              color="primary"
              onClick={handleClick}
              checked={values?.supply_point?.supply_point_accepted}
            />
          }
          label={
            <span>
              {t("FAIR_TITLE_LABEL")}
              <span
                style={{
                  color: theme.palette.primary.mainOrange,
                  marginLeft: 4,
                }}>
                *
              </span>
            </span>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="supply_point.verified"
              onClick={handleClickVerified}
              checked={values?.supply_point?.verified}
              color="primary"
              value={true}
            />
          }
          label={
            <span>
              {t("CUPS_VERIFY_LABEL")}
              <span
                style={{
                  color: theme.palette.primary.mainOrange,
                  marginLeft: 4,
                }}>
                *
              </span>
            </span>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TermsDialog
          title={t("FAIR_TITLE")}
          open={open}
          onAccept={handleAccept}
          onClose={handleClose}
          maxWidth="sm">
          <span
            dangerouslySetInnerHTML={{ __html: t("PRIVACY_POLICY_SUPLYPOINT") }}
          />
        </TermsDialog>
      </Grid>
    </Grid>
  )
}

export default NewHolderChangeSupplyPoint
