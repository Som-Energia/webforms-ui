import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { InvoiceIcon, CreditCardIcon } from '../../../data/icons/Icons'
import { checkIbanFormat } from '../../../services/utils'

import Chooser from '../../../components/Chooser/Chooser'
import InputTitle from '../../../components/InputTitle'
import InputField from '../../../components/InputField/InputField'
import TermsDialog from '../../../components/TermsDialog'

const PaymentMethod = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    sendTrackEvent
  } = props
  const { t } = useTranslation()
  const trackID = 'payment-method'

   useEffect(() => {
    sendTrackEvent(trackID)
  }, [])

  const handleMethodPaymentQuestion = (value) => {
    setFieldValue('new_member.payment_method', value)
  }

  const handleCheckIbanResponse = async () => {
    const valid = checkIbanFormat(values.new_member.iban)
    if (valid) {
      await setFieldError('new_member.iban_valid', undefined)
      setFieldValue('new_member.iban_valid', true)
    } else {
      await setFieldError('new_member.iban_valid', t('INVALID_IBAN'))
      setFieldValue('new_member.iban_valid', false)
    }
  }

  const handleInputIban = (event) => {
    let value = event.target.value
    if (value) {
      value = value.match(/[\s0-9A-Za-z]{0,29}/)
      value = value[0].toUpperCase()
      value = value.split(' ').join('')
      value = value.match(/.{1,4}/g).join(' ')
    }
    setFieldValue('new_member.iban', value)
  }

  const handleInputIbanBlur = () => {
    setFieldTouched('new_member.iban', true)
  }

  const [open, setOpen] = useState(false)

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('new_member.sepa_accepted', true)
    setFieldTouched('new_member.sepa_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('new_member.sepa_accepted', false)
    setFieldTouched('new_member.sepa_accepted', true)
  }

  useEffect(() => {
    if (values?.new_member?.iban && values?.new_member?.iban.length > 27) {
      handleCheckIbanResponse()
    }
  }, [values.new_member.iban])

  const options = [
    {
      id: 'iban',
      icon: <InvoiceIcon />,
      textHeader: t('IBAN_PAYMENT_QUESTION_OPTION'),
      textBody: t('PAYMENT_METHOD_IBAN_DESC')
    },
    {
      id: 'credit_card',
      icon: <CreditCardIcon />,
      textHeader: t('PAYMENT_METHOD_CCARD'),
      textBody: t('PAYMENT_METHOD_CCARD_DESC')
    }
  ]

  const showPaymentAuthorizationCheckbox = ['iban', 'credit_card'].includes(
    values?.new_member?.payment_method
  )
  const isIbanPayment = values?.new_member?.payment_method === 'iban'
  const isCreditCardPayment = values?.new_member?.payment_method === 'credit_card'
  const paymentAuthorizationLabel = isCreditCardPayment
    ? t('PAYMENT_METHOD_CCARD_ACCEPT')
    : t('IBAN_ACCEPT_DIRECT_DEBIT')
  const paymentAuthorizationValue = isCreditCardPayment
    ? values?.new_member?.payment_authorization_accepted
    : values?.new_member?.sepa_accepted

  const handleCheckboxChange = (event) => {
    const fieldName = isCreditCardPayment
      ? 'new_member.payment_authorization_accepted'
      : 'new_member.sepa_accepted'

    setFieldValue(fieldName, event.target.checked)
    setFieldTouched(fieldName, true)
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">{t('MEMBER_PAGE_PAYMENT_METHOD')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle
          text={t('PAYMENT_METHOD_QUESTION')}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="method-payment-question"
          options={options}
          value={values.new_member.payment_method}
          handleChange={handleMethodPaymentQuestion}
        />
      </Grid>
      {values?.new_member?.payment_method === 'iban' && (
        <>
          <Grid item xs={12}>
            <InputField
              name="iban_number"
              textFieldName={t('IBAN_FIELD')}
              textFieldNameHelper={t('IBAN_EXPLANATION')}
              textFieldHelper={t('IBAN_EXAMPLE')}
              handleChange={handleInputIban}
              handleBlur={handleInputIbanBlur}
              touched={touched?.new_member?.iban}
              value={values?.new_member.iban}
              error={errors?.new_member?.iban_valid || errors?.new_member?.iban}
              required={true}
            />
          </Grid>
        </>
      )}
      {isCreditCardPayment && (
        <Grid item xs={12}>
          <Typography variant="body.md.regular" color="primary.dark">
            {t('PAYMENT_METHOD_CCARD_INFO')}
          </Typography>
        </Grid>
      )}
      {showPaymentAuthorizationCheckbox && (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex' }}>
            <FormControlLabel
              control={
                <Checkbox
                  data-cy="iban_check"
                  checked={paymentAuthorizationValue}
                  onClick={isIbanPayment ? handleClick : undefined}
                  onChange={isCreditCardPayment ? handleCheckboxChange : undefined}
                />
              }
              label={
                <>
                  <Typography variant="body.sm.regular" color="primary.dark">
                    {paymentAuthorizationLabel}
                  </Typography>
                  <Typography variant="body.sm.bold" color="error">
                    {'*'}
                  </Typography>
                </>
              }
            />
          </Box>
        </Grid>
      )}
      {isIbanPayment && (
        <Grid item xs={12}>
          <TermsDialog
            title={t('SEPA_TITLE')}
            open={open}
            onAccept={handleAccept}
            onClose={handleClose}
            maxWidth="sm">
            <span
              dangerouslySetInnerHTML={{ __html: t('SEPA') }}
            />
          </TermsDialog>
        </Grid>
      )}
    </Grid>
  )
}

export default PaymentMethod
