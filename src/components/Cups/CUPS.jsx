import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

import { checkCups } from "../../services/api"
import InputField from "../InputField/InputField"

const defaultFunc = () => {}

const CUPS = (props) => {
  const {
    values,
    errors,
    touched,
    setValues = defaultFunc,
    setFieldValue = defaultFunc,
    setFieldError = defaultFunc,
    setFieldTouched = defaultFunc,
  } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const validateCups = useCallback(
    async (cups) => {
      setLoading(true)
      await setFieldValue("cups_valid", false, false)

      let cupsResponse
      try {
        cupsResponse = await checkCups(cups)

        const { status, knowledge_of_distri, tariff_name, has_social_tariff } =
          cupsResponse?.data || {}

        const new_contract = ["new", "inactive"].includes(status)

        setValues(
          (currentValues) => ({
            ...currentValues,
            ...{
              cups_valid: true,
              social_tariff: has_social_tariff,
              new_contract,
              knowledge_of_distri,
              tariff_name,
            },
          }),
          true,
        )
      } catch {
        setFieldError("cups", t("ERROR_INVALID_FIELD"))
        setValues(
          (currentValues) => ({
            ...currentValues,
            ...{
              cups_valid: false,
              social_tariff: false,
            },
          }),
          true,
        )
      } finally {
        setLoading(false)
      }
    },
    [setFieldValue, setFieldError, setValues, t],
  )

  useEffect(() => {
    const cups = values.cups
    if (cups?.length >= 20 && cups?.length <= 22) {
      validateCups(cups)
    }
  }, [values.cups, validateCups])

  const handleInputCups = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]*/)
    value = value[0].toUpperCase()
    setFieldValue("cups", value)
  }

  const handleInputCupsBlur = () => {
    setFieldTouched("cups", true)
  }

  return (
    <InputField
      name="cups"
      textFieldName={t("CUPS_FIELD")}
      textFieldHelper={
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            letterSpacing: 0,
            color: "secondary.extraDark",
          }}>
          {t("CUPS_HELPER_TEXT")}{" "}
          <Link
            href={t("CUPS_HELPER_URL")}
            target="_blank"
            rel="noopener noreferrer">
            {t("CUPS_HELPER_LINK")}
          </Link>
        </Typography>
      }
      handleChange={handleInputCups}
      handleBlur={handleInputCupsBlur}
      touched={touched?.cups}
      value={values?.cups}
      error={
        errors?.cups ||
        errors?.new_contract ||
        errors?.knowledge_of_distri ||
        errors?.cups_valid
      }
      isLoading={loading}
      required={true}
    />
  )
}

export default CUPS
