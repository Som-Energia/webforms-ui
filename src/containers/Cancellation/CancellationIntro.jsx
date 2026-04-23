import React from "react"
import { useTranslation } from "react-i18next"

import Box from "@mui/material/Box"

import Card from "../../components/oficinavirtual/Card"
import Header from "../../components/oficinavirtual/Header"

const CancellationIntro = () => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        position: "relative",
        color: "text.primary",
      }}>
      <Header>{t("CANCELLATION_INTRO_TITLE")}</Header>
      <Card>
        <div
          dangerouslySetInnerHTML={{
            __html: t("CANCELLATION_INTRO_BODY", {
              url_new: t("FAQ_ALTA_SUMINISTRAMENT_URL"),
              url_holderchange: t("FAQ_HOLDERCHANGE_URL"),
            }),
          }}
        />
      </Card>
    </Box>
  )
}

export default CancellationIntro
