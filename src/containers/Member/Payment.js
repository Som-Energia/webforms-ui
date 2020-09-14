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
import Typography from '@material-ui/core/Typography'

import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import StepHeader from '../../components/StepHeader'
import Chooser from '../../components/Chooser'
import TermsDialog from '../../components/TermsDialog'

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
}))

function Payment (props) {
  const { t } = useTranslation()
  const classes = useStyles()
  const { values, handleBlur, setFieldValue, errors, touched, handleChange } = props
  return (
    <>
      <StepHeader title={t('PAYMENT_METHOD_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('PAYMENT_METHOD_DESC') }}
      />
      <Box mt={3}>
        <Chooser
          question={t('PAYMENT_METHOD')}
          onChange={handleChange}
          onBlur={handleBlur}
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
      <Box mt={5}>

      </Box>
    </>
  )
}

export default Payment
