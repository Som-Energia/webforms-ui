import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

import StepHeader from '../../components/StepHeader'
import TermsDialog from '../../components/TermsDialog'
import { checkIbanFormat } from '../../services/utils'

// TODO: Use IBANField
function IBAN(props) {
  const { t } = useTranslation()
  const { values, handleBlur, setFieldValue, errors, touched } = props

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

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

  const handleInputChange = (event) => {
    let value = event.target.value
    if (value) {
      value = value.match(/[\s0-9A-Za-z]{0,29}/)
      value = value[0].toUpperCase()
      value = value.split(' ').join('')
      value = value.match(/.{1,4}/g).join(' ')
    }
    setFieldValue('payment.sepa_accepted', false, false)
    setFieldValue('payment.iban', value)
  }

  useEffect(() => {
    if (values.payment.iban.length > 27) {
      const valid = checkIbanFormat(values.payment.iban)
      setFieldValue('payment.iban_valid', valid)
    } else {
      setFieldValue('payment.iban_valid', false)
    }
  }, [values.payment.iban, setFieldValue])

  return (
    <>
      <StepHeader title={t('PAYMENT_TITLE')} />
      <Box className="step-body">
        <Box mt={2} mb={0}>
          <TextField
            id="iban"
            sx={{
              '& path': {
                color: 'secondary.dark'
              }
            }}
            label={t('IBAN_LABEL')}
            name="payment.iban"
            value={values.payment.iban}
            variant="outlined"
            fullWidth
            required
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceOutlinedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading && <CircularProgress size={24} />}
                  {!isLoading && values.payment?.iban_valid && (
                    <CheckOutlinedIcon color="primary" />
                  )}
                </InputAdornment>
              )
            }}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={
              (errors?.payment?.iban || errors?.payment?.iban_valid) &&
              touched?.payment?.iban
            }
            helperText={
              (touched?.payment?.iban &&
                (errors?.payment?.iban || errors?.payment?.iban_valid)) ||
              t('IBAN_HELP')
            }
          />
        </Box>
        <Box mt={4} mb={3}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={values.payment?.iban_valid !== true}
                name="payment.sepa_accepted"
                checked={values.payment.sepa_accepted}
                onClick={handleClick}
                color="primary"
                value={true}
              />
            }
            label={t('IBAN_ACCEPT_DIRECT_DEBIT')}
          />
        </Box>
      </Box>

      <TermsDialog
        title={t('SEPA_TITLE')}
        open={open}
        onAccept={handleAccept}
        onClose={handleClose}>
        <span dangerouslySetInnerHTML={{ __html: t('SEPA') }} />
      </TermsDialog>
    </>
  )
}

export default IBAN
