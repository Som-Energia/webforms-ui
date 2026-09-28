import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import Chooser from "../../../components/Chooser/Chooser"
import TemporalOption from "../../../components/Chooser/TemporalOption"
import InputTitle from "../../../components/InputTitle"
import {
  CommunityIcon,
  GiftIcon,
  HandshakeIcon,
  HeartIcon,
} from "../../../data/icons/Icons"

const NewContractMemberQuestion = ({
  formikProps,
  nextStep,
  setValidationSchemaAndSteps,
  sendTrackEvent,
}) => {
  const { values, setFieldValue, setValues } = formikProps
  const { t } = useTranslation()
  const trackID = "member-question"
  const [hasMember, setHasMember] = useState(false)
  const campaignIsEnabled = JSON.parse(
    import.meta.env.VITE_FEATURE_FLAGS || "{}",
  ).isNonMemberCampaignEnabled
  const campaignVat = import.meta.env.VITE_CAMPAIGN_VAT
  const campaignMemberNumber = import.meta.env.VITE_CAMPAIGN_MEMBER_NUMBER

  const handleMemberQuestion = (value) => {
    if (value === "campaign-offer") {
      setValues({
        ...values,
        has_member: value,
        member: {
          number: campaignMemberNumber,
          nif: campaignVat,
        },
      })
    } else {
      setFieldValue("has_member", value)
    }
    setHasMember(value)
  }

  useEffect(() => {
    if (hasMember) {
      nextStep(formikProps)
      setValidationSchemaAndSteps(hasMember)
    }
  }, [hasMember])

  useEffect(() => {
    sendTrackEvent(trackID)
    setValues({
      ...values,
      member: {
        number: "",
        nif: "",
      },
    })
  }, [])

  const options = [
    {
      id: "member-link",
      icon: <HandshakeIcon />,
      textHeader: t("HAS_LINK_MEMBER"),
      textBody: t("HAS_LINK_MEMBER_BODY"),
    },
    {
      id: "member-off",
      icon: <HeartIcon />,
      textHeader: t("HAS_NO_MEMBER"),
      textBody: t("HAS_NO_MEMBER_BODY"),
    },
    {
      id: "member-on",
      icon: <CommunityIcon />,
      textHeader: t("HAS_MEMBER"),
      textBody: t("HAS_MEMBER_BODY"),
    },
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t("CONTRACT_QUESTION_TITLE")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.sm.regular" color="secondary.extraDark">
          {t("CONTRACT_QUESTION_DESC")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.sm.regular" color="secondary.extraDark">
          {t("MEMBER_PAYMENT_INFO")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle text={t("CONTRACT_QUESTION")} required={true} />
      </Grid>
      <Grid item>
        <Chooser
          name="member-question"
          options={options}
          value={values?.has_member}
          handleChange={handleMemberQuestion}
          maxWidth="18rem"
        />
        {campaignIsEnabled ? (
          <Grid container direction="row" mt={4} justifyContent="center">
            <Grid item xs={12} sm={12} md={8} lg={12}>
              <TemporalOption
                optionId="campaign-offer"
                icon={<GiftIcon />}
                isSelected={values?.has_member === "campaign-offer"}
                setSelected={handleMemberQuestion}
                textHeader={t("NON_MEMBER_CAMPAIGN")}
                textBody={t("NON_MEMBER_CAMPAIGN_DESCRIPTION")}
                maxWidth="18rem"
              />
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  )
}

export default NewContractMemberQuestion
