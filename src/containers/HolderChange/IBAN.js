import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

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

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
}))

function IBAN (props) {
  const { t } = useTranslation()
  const classes = useStyles()
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

  const handleInputChange = event => {
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
      setIsLoading(true)
      checkIban(values.payment.iban)
        .then(response => {
          console.log(response)
          setFieldValue('payment.iban_valid', response?.state === true)
          setIsLoading(false)
        })
        .catch(error => {
          const errorStatus = error?.response?.data?.state ? error?.response?.data?.state : false
          setFieldValue('payment.iban_valid', errorStatus)
          setIsLoading(false)
        })
    } else {
      setFieldValue('payment.iban_valid', false)
    }
  }, [values.payment.iban, setFieldValue])

  return (
    <>
      <StepHeader title={t('PAYMENT_TITLE')} />
      <Box mt={5} mb={1}>
        <TextField
          id="iban"
          className={classes.icon}
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
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={(errors?.payment?.iban || errors?.payment?.iban_valid) && touched?.payment?.iban}
          helperText={(touched?.payment?.iban && (errors?.payment?.iban || errors?.payment?.iban_valid)) || t('IBAN_HELP')}
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

      <TermsDialog
        title={t('SEPA_TITLE')}
        open={open}
        onAccept={handleAccept}
        onClose={handleClose}
      >
        <span dangerouslySetInnerHTML={{ __html: t('SEPA') }} />
      </TermsDialog>
    </>
  )
}

export default IBAN
