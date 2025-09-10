import React from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader3, textHeader4, textBody1, textHeader2 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import InputField from '../../../../components/InputField'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { iconRequirements } from '../../../../themes/commonStyles'
import Grid from '@mui/material/Grid'
import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../../../components/NewChooser'
import { useState } from 'react'

const Payment = (props) => {

  const { t } = useTranslation()
  const { values, setFieldValue } = props
  const [paymentMethod, setPaymentMethod] = useState('')

  const NEW_MEMBER_COST = 100
  const chooserOptions = [
    {
      id: 'transfer',
      icon: <CurrencyExchangeIcon sx={iconRequirements} />,
      textHeader: t('GURB_TRANSFER_PAYMENT_METHOD'),
    },
    {
      id: 'tpv',
      icon: <CreditCardIcon sx={iconRequirements} />,
      textHeader: t('GURB_TPV_PAYMENT_METHOD'),
    }
  ]

  const handlePaymentMethodChange = (value) => {
    if (value === 'transfer') {
      setPaymentMethod('transfer')
    }
    if (value === 'tpv') {
      setPaymentMethod('tpv')
    }
  }

  return (
    <>
      <Box mb={2}>
        <Typography sx={{ ...textHeader2, mb: 5 }}>{t('GURB_PAYMENT')}</Typography>
        <Typography sx={textHeader4}>{t('GURB_PAYMENT_REVIEW_TITLE_CUSTOMER_COST')}</Typography>
        <Typography sx={textBody1}>{t('GURB_PAYMENT_REVIEW_TEXT_CUSTOMER_COST')}</Typography>
        <InputField
          name='customer_cost'
          value={NEW_MEMBER_COST + '€'}
          readonlyField={true}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', width: "100%", gap: 2 }}>
        <Typography sx={textHeader3}>{t("Total a pagar")}</Typography>
        <Typography sx={textBody1}>{(NEW_MEMBER_COST + values.contract.gurb_power_cost) + " € " + t("IVA inclós")}</Typography>
      </Box>

      <Grid item xs={12} sx={{ mt: 6 }}>
        <TextRecomendation sx={textBody1} title={t('GURB_PAYMENT_METHOD_CHOOSER_TITLE')} required={true} />
        <Box>
          <Chooser
            name="payment-method"
            options={chooserOptions}
            value={paymentMethod}
            handleChange={handlePaymentMethodChange}
          />
        </Box>
      </Grid>
    </>
  )
}

export default Payment
