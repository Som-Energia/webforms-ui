import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Chooser from '../../containers/Gurb/components/Chooser'
import InputTitle from '../../containers/Gurb/components/InputTitle'
import InputField from '../../containers/Gurb/components/InputField'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import { ReceiptIcon, CreditCardIcon } from '../../data/icons/Icons'
import { checkIbanFormat } from '../../services/utils'
import GurbLoadingContext from '../../context/GurbLoadingContext'

const PaymentMethod = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = props
  const { t } = useTranslation()
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handleMethodPaymentQuestion = (value) => {
    setFieldValue('new_member.payment_method', value)
  }

  const handleCheckIbanResponse = async () => {
    setLoading(true)
    const valid = checkIbanFormat(values.new_member.iban)
    if (valid) {
      await setFieldError('new_member.iban_valid', undefined)
      setFieldValue('new_member.iban_valid', true)
    } else {
      await setFieldError('holder.iban_valid', t('INVALID_IBAN'))
      setFieldValue('new_member.iban_valid', false)
    }
    setLoading(false)
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
    let value = event.target.checked
    await setFieldValue('new_member.sepa_accepted', value)
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
      icon: <ReceiptIcon />,
      textHeader: t('PAYMENT_METHOD_IBAN'),
      textBody: t('PAYMENT_METHOD_IBAN_DESC'),
    },
    {
      id: 'credit_card',
      icon: <CreditCardIcon />,
      textHeader: t('PAYMENT_METHOD_CCARD'),
      textBody: t('PAYMENT_METHOD_CCARD_DESC'),
    },
  ]

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">
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
              name="iban"
              textFieldName={t('GURB_IBAN_FIELD')}
              textFieldHelper={t('GURB_IBAN_EXAMPLE')}
              handleChange={handleInputIban}
              handleBlur={handleInputIbanBlur}
              touched={touched?.new_member?.iban}
              value={values?.new_member.iban}
              error={errors?.new_member?.iban_valid || errors?.new_member?.iban}
              isLoading={loading}
              required={true}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  data-cy="iban_check"
                  checked={values?.new_member?.sepa_accepted}
                  onChange={handleCheckboxChange}
                />
              }
              label={t('GURB_ACCEPT_DIRECT_DEBIT')}
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default PaymentMethod
