import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import Chooser from '../../components/Chooser'
import IBANField from '../../components/IBANField'
import TermsDialog from '../../components/TermsDialog'

function Payment(props) {
  const { t } = useTranslation()
  const { values, handleBlur, setFieldValue, errors, touched } = props
  const [open, setOpen] = useState(false)

  const handleChange = ({ option }) => {
    setFieldValue('payment.payment_method', option)
  }

  const handleIBANChange = ({ IBAN, IBANValid }) => {
    setFieldValue('payment.iban', IBAN, false)
    setFieldValue('payment.iban_valid', IBANValid)
  }

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('payment.sepa_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('payment.sepa_accepted', false)
  }

  return (
    <>
      <StepHeader title={t('PAYMENT_METHOD_TITLE')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('PAYMENT_METHOD_DESC') }}
      />
      <Box mt={3}>
        <Chooser
          question={t('PAYMENT_METHOD')}
          onChange={handleChange}
          value={values.payment.payment_method}
          options={[
            {
              value: 'iban',
              label: t('PAYMENT_METHOD_IBAN'),
              description: t('PAYMENT_METHOD_IBAN_DESC')
            },
            {
              value: 'credit_card',
              label: t('PAYMENT_METHOD_CCARD'),
              description: t('PAYMENT_METHOD_CCARD_DESC')
            }
          ]}
        />
      </Box>
      {values.payment.payment_method === 'iban' && (
        <>
          <Box mt={6}>
            <IBANField
              id="iban"
              name="payment.iban"
              label={t('IBAN_LABEL')}
              onChange={handleIBANChange}
              onBlur={handleBlur}
              value={values?.payment?.iban}
              error={
                (errors?.payment?.iban || errors?.payment?.iban_valid) &&
                touched?.payment?.iban
              }
              helperText={
                (touched?.payment?.iban &&
                  (errors?.payment?.iban || errors?.payment?.iban_valid)) ||
                t('IBAN_HELP')
              }
              variant="outlined"
            />
          </Box>
          <Box mt={3} mb={0}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={values.payment?.iban_valid !== true}
                  name="payment.sepa_accepted"
                  checked={values.payment?.sepa_accepted}
                  onClick={handleClick}
                  color="primary"
                />
              }
              label={t('IBAN_ACCEPT_DIRECT_DEBIT')}
            />
          </Box>

          <TermsDialog
            title={t('SEPA_TITLE')}
            open={open}
            onAccept={handleAccept}
            onClose={handleClose}>
            <span dangerouslySetInnerHTML={{ __html: t('SEPA') }} />
          </TermsDialog>
        </>
      )}
    </>
  )
}

export default Payment
