import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { ReceiptIcon, CreditCardIcon } from '../../../data/icons/Icons'
import { checkIbanFormat } from '../../../services/utils'

import Chooser from '../../../components/Chooser/Chooser'
import InputTitle from '../../../components/InputTitle'
import InputField from '../../../components/InputField/InputField'
import PaymentAuthorizationCheckbox from '../../../components/PaymentAuthorizationCheckbox/PaymentAuthorizationCheckbox'

const PaymentMethod = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched
  } = props
  const { t } = useTranslation()

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

  const handleCheckboxChange = async (event) => {
    const fieldName = isCreditCardPayment
      ? 'new_member.payment_authorization_accepted'
      : 'new_member.sepa_accepted'

    await setFieldValue(fieldName, event.target.checked)
    setFieldTouched(fieldName, true)
  }

  useEffect(() => {
    if (values?.new_member?.iban && values?.new_member?.iban.length > 27) {
      handleCheckIbanResponse()
    }
  }, [values.new_member.iban])

  const options = [
    {
      id: 'iban',
      icon: <ReceiptIcon />,
      textHeader: t('PAYMENT_METHOD_IBAN'),
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
  const isCreditCardPayment = values?.new_member?.payment_method === 'credit_card'
  const paymentAuthorizationLabel = isCreditCardPayment
    ? t('PAYMENT_METHOD_CCARD_ACCEPT')
    : t('IBAN_ACCEPT_DIRECT_DEBIT')
  const paymentAuthorizationValue = isCreditCardPayment
    ? values?.new_member?.payment_authorization_accepted
    : values?.new_member?.sepa_accepted

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t('MEMBER_PAGE_PAYMENT_METHOD')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle
          text={t('MEMBER_PAGE_PAYMENT_METHOD_QUESTION')}
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
      {values?.new_member?.payment_method == 'iban' && (
        <>
          <Grid item xs={12}>
            <InputField
              name="iban_number"
              textFieldName={t('MEMBER_PAGE_IBAN')}
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
      {showPaymentAuthorizationCheckbox && (
        <Grid item xs={12}>
          <PaymentAuthorizationCheckbox
            dataCy="iban_check"
            checked={paymentAuthorizationValue}
            label={paymentAuthorizationLabel}
            onChange={handleCheckboxChange}
          />
        </Grid>
      )}
    </Grid>
  )
}

export default PaymentMethod
