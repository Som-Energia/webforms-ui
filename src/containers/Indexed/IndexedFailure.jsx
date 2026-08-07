import React from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import CloseIcon from "@mui/icons-material/Close"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"

import StepHeader from "../../components/OldComponents/StepHeader"
import { useSyncLanguage } from "../../hooks/useTranslateOptions"
import Result from "../Result"
import indexedErrorText from "./IndexedError"

function Failure(props) {
  const { language } = useParams()
  const { t } = useTranslation()
  const { error = false, showHeader = true } = props

  useSyncLanguage(language)

  return (
    <>
      {showHeader && <StepHeader title={t("FAILURE_TITLE")} />}
      <Box
        sx={{
          pt: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar
          sx={{
            width: 6,
            height: 6,
            color: "secondary.extraDark",
            backgroundColor: "transparent",
            border: "2px solid",
            borderColor: "secondary.extraDark",
            mb: 3,
          }}>
          <CloseIcon fontSize="large" />
        </Avatar>
        <Result
          mode={"failure"}
          {...props}
          title={t("FAILURE_TEXT")}
          description={indexedErrorText(t, error.code, error.data)}
        />
      </Box>
    </>
  )
}

export default Failure
