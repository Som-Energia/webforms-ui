import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { checkIban } from '../../services/api'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'

import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import StepHeader from '../../components/StepHeader'
import TermsDialog from '../../components/TermsDialog'

import generalTerms from '../../data/HolderChange/generalterms'

function IBAN (props) {
  const { t } = useTranslation()
  const { values, handleChange, handleBlur, setFieldValue, errors, touched } = props

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


  useEffect(() => {
    if (values.payment.iban.length > 8) {
      setIsLoading(true)
      checkIban(values.payment.iban)
        .then(response => {
          console.log(response)
          setFieldValue('payment.iban_valid', response?.state === true)
          setIsLoading(false)
        })
        .catch(error => {
          console.log(error.response)
          const errorStatus = error?.response?.data?.state ? error?.response?.data?.state : false
          setFieldValue('payment.iban_valid', errorStatus)
          setIsLoading(false)
        })
    } else {
      setFieldValue('payment.iban_valid', values.payment.iban.length !== 0)
    }
  }, [values.payment.iban, setFieldValue])

  return (
    <>
      <StepHeader title={t('PAYMENT_TITLE')} />
      <Box mt={5} mb={1}>
        <TextField
          id="iban"
          label={t('IBAN_LABEL')}
          name="payment.iban"
          value={values.payment.iban}
          variant="outlined"
          fullWidth
          required
          autoFocus
          InputProps={{
            startAdornment:
              <InputAdornment position="start">
                <AccountBalanceOutlinedIcon />
              </InputAdornment>,
            endAdornment:
            <InputAdornment position="end">
              { isLoading &&
                <CircularProgress size={24} />
              }
              { !isLoading && values.payment?.iban_valid &&
                <CheckOutlinedIcon color="primary" />
              }
            </InputAdornment>
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={(errors?.payment?.iban || errors?.payment?.iban_valid) && touched?.payment?.iban}
          helperText={(touched?.payment?.iban && (errors?.payment?.iban || errors?.payment?.iban_valid)) || t('IBAN_HELP')}
        />
      </Box>
      <Box mt={4} mb={3}>
        <FormControlLabel
          control={
            <Checkbox
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

      <TermsDialog
        title={t('GENERAL_TERMS')}
        content={generalTerms}
        open={open}
        onAccept={handleAccept}
        onClose={handleClose}
      />
    </>
  )
}

export default IBAN
