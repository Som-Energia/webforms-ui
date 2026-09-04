import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import Chooser from "../../../components/Chooser/Chooser"
import InputField from "../../../components/InputField/InputField"
import InputTitle from "../../../components/InputTitle"
import PaymentAuthorizationCheckbox from "../../../components/PaymentAuthorizationCheckbox/PaymentAuthorizationCheckbox"
import TermsDialog from "../../../components/TermsDialog"
import { CreditCardIcon, InvoiceIcon } from "../../../data/icons/Icons"
import { checkIbanFormat } from "../../../services/utils"
import { creditCardPaymentEnabled } from "../paymentMethods"

const paymentMethods = [
  {
    method: "iban",
    fieldName: "sepa_accepted",
    description: "SEPA",
    acceptLabel: "IBAN_ACCEPT_DIRECT_DEBIT",
  },
  {
    method: "credit_card",
    fieldName: "payment_authorization_accepted",
    description: "PAYMENT_CCARD_TERMS",
    acceptLabel: "PAYMENT_METHOD_CCARD_ACCEPT",
    info: "PAYMENT_METHOD_CCARD_INFO",
  },
]

const PaymentMethod = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    sendTrackEvent,
  } = props
  const { t } = useTranslation()
  const trackID = "payment-method"

  useEffect(() => {
    sendTrackEvent(trackID)
  }, [])

  const handleMethodPaymentQuestion = (value) => {
    setFieldValue("new_member.payment_method", value)
  }

  const handleCheckIbanResponse = async () => {
    const valid = checkIbanFormat(values.new_member.iban)
    if (valid) {
      await setFieldError("new_member.iban_valid", undefined)
      setFieldValue("new_member.iban_valid", true)
    } else {
      await setFieldError("new_member.iban_valid", t("INVALID_IBAN"))
      setFieldValue("new_member.iban_valid", false)
    }
  }

  const handleInputIban = (event) => {
    let value = event.target.value
    if (value) {
      value = value.match(/[\s0-9A-Za-z]{0,29}/)
      value = value[0].toUpperCase()
      value = value.split(" ").join("")
      value = value.match(/.{1,4}/g).join(" ")
    }
    setFieldValue("new_member.iban", value)
  }

  const handleInputIbanBlur = () => {
    setFieldTouched("new_member.iban", true)
  }

  const [open, setOpen] = useState(false)

  const openPaymentDialog = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = (fieldName) => () => {
    setOpen(false)
    setFieldValue(fieldName, true)
    setFieldTouched(fieldName, true)
  }

  const handleClose = (fieldName) => () => {
    setOpen(false)
    setFieldValue(fieldName, false)
    setFieldTouched(fieldName, true)
  }

  useEffect(() => {
    const iban = values?.new_member?.iban
    if (iban) {
      handleCheckIbanResponse()
    } else {
      setFieldValue("new_member.iban_valid", false)
      setFieldError("new_member.iban_valid", t("REQUIRED_FIELD"))
    }
  }, [values?.new_member?.iban])

  const options = [
    {
      id: "iban",
      icon: <InvoiceIcon />,
      textHeader: t("IBAN_PAYMENT_QUESTION_OPTION"),
      textBody: t("PAYMENT_METHOD_IBAN_DESC"),
    },
    ...(creditCardPaymentEnabled
      ? [
          {
            id: "credit_card",
            icon: <CreditCardIcon />,
            textHeader: t("PAYMENT_METHOD_CCARD"),
            textBody: t("PAYMENT_METHOD_CCARD_DESC"),
          },
        ]
      : []),
  ]

  const activePayment = paymentMethods.find(
    (item) => item.method === values?.new_member?.payment_method,
  )

  const paymentAuthorizationValue =
    values?.new_member?.[activePayment?.fieldName]

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t("MEMBER_PAGE_PAYMENT_METHOD")}
        </Typography>
      </Grid>
      {creditCardPaymentEnabled && (
        <>
          <Grid item xs={12}>
            <InputTitle text={t("PAYMENT_METHOD_QUESTION")} required={true} />
          </Grid>
          <Grid item xs={12}>
            <Chooser
              name="method-payment-question"
              options={options}
              value={values.new_member.payment_method}
              handleChange={handleMethodPaymentQuestion}
            />
          </Grid>
        </>
      )}
      {activePayment && (
        <>
          {activePayment?.method === "iban" && (
            <>
              <Grid item xs={12}>
                <InputField
                  name="iban_number"
                  textFieldName={t("IBAN_FIELD")}
                  textFieldNameHelper={t("IBAN_EXPLANATION")}
                  textFieldHelper={t("IBAN_EXAMPLE")}
                  handleChange={handleInputIban}
                  handleBlur={handleInputIbanBlur}
                  touched={touched?.new_member?.iban}
                  value={values?.new_member.iban}
                  error={
                    errors?.new_member?.iban_valid || errors?.new_member?.iban
                  }
                  required={true}
                />
              </Grid>
            </>
          )}
          {activePayment?.info && (
            <>
              <Grid item xs={12}>
                <Typography variant="body.md.regular" color="primary.dark">
                  {t(activePayment.info)}
                </Typography>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <PaymentAuthorizationCheckbox
              dataCy="payment_auth_check"
              checked={paymentAuthorizationValue}
              label={t(activePayment.acceptLabel)}
              onClick={openPaymentDialog}
            />
          </Grid>
          <Grid item xs={12}>
            <TermsDialog
              title={t("SEPA_TITLE")}
              open={open}
              onAccept={handleAccept(`new_member.${activePayment.fieldName}`)}
              onClose={handleClose(`new_member.${activePayment.fieldName}`)}
              maxWidth="sm">
              <span
                dangerouslySetInnerHTML={{
                  __html: t(activePayment.description),
                }}
              />
            </TermsDialog>
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default PaymentMethod
