import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Grid2 as Grid } from "@mui/material"
import Typography from "@mui/material/Typography"

import Chooser from "../../../components/Chooser/Chooser"
import DragDrop from "../../../components/DragDrop"
import {
  CommunityIcon,
  HandshakeIcon,
  HeartIcon,
  PersonalIcon,
} from "../../../data/icons/Icons"
import { creditCardPaymentEnabled } from "../../NewContractMember/paymentMethods"

const NewHolderChangeEspecialCases = ({ ...props }) => {
  const { values, setFieldValue, setValues, sendTrackEvent } = props
  const { t } = useTranslation()
  const trackID = "especial-cases-question"
  const selectedReasons =
    values.especial_cases === "reason_death_electrodep"
      ? ["reason_death", "reason_electrodep"]
      : [values.especial_cases]

  const handleEspecialCasesQuestion = (value) => {
    setValues((previousValues) => {
      const previousReasons =
        previousValues.especial_cases === "reason_death_electrodep"
          ? ["reason_death", "reason_electrodep"]
          : [previousValues.especial_cases]
      let reason = value

      if (value === "reason_death" || value === "reason_electrodep") {
        const reasons = ["reason_death", "reason_electrodep"].filter(
          (candidate) =>
            candidate === value
              ? !previousReasons.includes(candidate)
              : previousReasons.includes(candidate),
        )
        reason =
          reasons.length === 2
            ? "reason_death_electrodep"
            : (reasons[0] ?? "reason_holder_change")
      }

      return {
        ...previousValues,
        especial_cases: reason,
        supply_point:
          reason !== "reason_holder_change"
            ? {
                ...previousValues.supply_point,
                attachments_reason_merge: [],
                attachments_reason_death:
                  previousReasons.includes("reason_death") &&
                  (reason === "reason_death" ||
                    reason === "reason_death_electrodep")
                    ? previousValues.supply_point.attachments_reason_death
                    : [],
                attachments_reason_electrodep:
                  previousReasons.includes("reason_electrodep") &&
                  (reason === "reason_electrodep" ||
                    reason === "reason_death_electrodep")
                    ? previousValues.supply_point.attachments_reason_electrodep
                    : [],
                attachments_reason_electrodep_census:
                  previousReasons.includes("reason_electrodep") &&
                  (reason === "reason_electrodep" ||
                    reason === "reason_death_electrodep")
                    ? previousValues.supply_point
                        .attachments_reason_electrodep_census
                    : [],
              }
            : previousValues.supply_point,
        new_member: {
          ...previousValues.new_member,
          payment_method:
            reason === "reason_holder_change" && creditCardPaymentEnabled
              ? ""
              : "iban",
        },
      }
    })
  }

  useEffect(() => {
    sendTrackEvent(trackID)
    setValues({
      ...values,
    })
  }, [])

  const default_option = [
    {
      id: "reason_holder_change",
      icon: <CommunityIcon />,
      textHeader: t("SPECIAL_CASES_HOLDER_CHANGE"),
      textBody: t("SPECIAL_CASES_REASON_HOLDER_CHANGE"),
    },
  ]

  const options = [
    {
      id: "reason_death",
      icon: <PersonalIcon />,
      textHeader: t("SPECIAL_CASES_DEATH"),
      textBody: t("SPECIAL_CASES_REASON_DEATH"),
    },
    {
      id: "reason_merge",
      icon: <HandshakeIcon />,
      textHeader: t("SPECIAL_CASES_MERGE"),
      textBody: t("SPECIAL_CASES_REASON_MERGE"),
    },
    {
      id: "reason_electrodep",
      icon: <HeartIcon />,
      textHeader: t("SPECIAL_CASES_ELECTRODEP"),
      textBody: t("SPECIAL_CASES_REASON_ELECTRODEP"),
    },
  ]

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="headline4.regular">
          {t("SPECIAL_CASES_TITLE")}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Chooser
          name="especial-cases-default"
          options={default_option}
          value={values?.especial_cases}
          handleChange={handleEspecialCasesQuestion}
          maxWidth="18rem"
        />
      </Grid>
      <Grid size={{ xs: 12 }} textAlign={"center"}>
        <Typography variant="body.sm.regular" color="secondary.extraDark">
          {t("SPECIAL_CASES_QUESTION")}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Chooser
          name="especial-cases-question"
          options={options}
          value={selectedReasons}
          handleChange={handleEspecialCasesQuestion}
          maxWidth="18rem"
        />
      </Grid>
      <>
        {selectedReasons.includes("reason_death") && (
          <Grid size={{ xs: 12 }} textAlign={"center"}>
            <DragDrop
              fieldName={t("CERT_ATTACH_DEATH")}
              textStyle={"body.md.regular"}
              required={false}
              values={values.supply_point.attachments_reason_death}
              onChange={(fileHash) =>
                setFieldValue("supply_point.attachments_reason_death", fileHash)
              }
            />
          </Grid>
        )}
        {values?.especial_cases === "reason_merge" && (
          <Grid size={{ xs: 12 }} textAlign={"center"}>
            <DragDrop
              fieldName={t("CERT_ATTACH_MERGE")}
              textStyle={"body.md.regular"}
              required={false}
              values={values.supply_point.attachments_reason_merge}
              onChange={(fileHash) =>
                setFieldValue("supply_point.attachments_reason_merge", fileHash)
              }
            />
          </Grid>
        )}
        {selectedReasons.includes("reason_electrodep") && (
          <>
            <Grid size={{ xs: 12 }} textAlign={"center"}>
              <DragDrop
                fieldName={t("ELECTRODEP_ATTACH_MEDICAL")}
                textStyle={"body.md.regular"}
                required={false}
                values={values.supply_point.attachments_reason_electrodep}
                onChange={(fileHash) =>
                  setFieldValue(
                    "supply_point.attachments_reason_electrodep",
                    fileHash,
                  )
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }} textAlign={"center"}>
              <DragDrop
                fieldName={t("ELECTRODEP_ATTACH_RESIDENT")}
                textStyle={"body.md.regular"}
                required={false}
                values={
                  values.supply_point.attachments_reason_electrodep_census
                }
                onChange={(fileHash) =>
                  setFieldValue(
                    "supply_point.attachments_reason_electrodep_census",
                    fileHash,
                  )
                }
              />
            </Grid>
          </>
        )}
      </>
    </Grid>
  )
}

export default NewHolderChangeEspecialCases
