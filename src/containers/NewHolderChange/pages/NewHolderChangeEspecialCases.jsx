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

const NewHolderChangeEspecialCases = ({ ...props }) => {
  const { values, setFieldValue, setValues, sendTrackEvent } = props
  const { t } = useTranslation()
  const trackID = "especial-cases-question"

  const handleEspecialCasesQuestion = (value) => {
    setFieldValue("especial_cases", value)
  }

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

  const default_option = [
    {
      id: "reason_holder_change",
      icon: <CommunityIcon />,
      textHeader: t("SPECIAL_CASES_HOLDER_CHANGE"),
      textBody: t("SPECIAL_CASES_REASON_DEFAULT"),
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
          value={values?.especial_cases}
          handleChange={handleEspecialCasesQuestion}
          maxWidth="18rem"
        />
      </Grid>
      {values?.especial_cases === "reason_death" ? (
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
      ) : values?.especial_cases === "reason_merge" ? (
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
      ) : values?.especial_cases === "reason_electrodep" ? (
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
              values={values.supply_point.attachments_reason_electrodep_census}
              onChange={(fileHash) =>
                setFieldValue(
                  "supply_point.attachments_reason_electrodep_census",
                  fileHash,
                )
              }
            />
          </Grid>
        </>
      ) : null}
    </Grid>
  )
}

export default NewHolderChangeEspecialCases
