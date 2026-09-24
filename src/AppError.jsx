import { useTranslation } from "react-i18next"

import AlertBox from "./components/AlertBox/AlertBox"

export default function AppError() {
  const { t } = useTranslation()
  return (
    <>
      <AlertBox
        icon="error"
        textAlign="left"
        severity="error"
        title={t("TOKEN_FORM_ERROR")}
        description={t("TOKEN_FORM_ERROR_DESCRIPTION")}
      />
    </>
  )
}
