import React from 'react'
import { useTranslation } from 'react-i18next'

import StepHeader from '../../components/StepHeader'
import IBANField from '../../components/OldComponents/IBANField'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import EuroIcon from '@mui/icons-material/Euro'

import { contributionParams } from '../../services/utils'

const ContributionDetails = (props) => {
  const { values, handleChange, handleBlur, errors, touched, setFieldValue } =
    props
  const { t } = useTranslation()

  const handleIBANChange = ({ IBAN, IBANValid }) => {
    setFieldValue('payment.iban', IBAN, false)
    setFieldValue('payment.iban_valid', IBANValid)
  }

  const handleClickSepa = (event) => {
    event.preventDefault()
    setFieldValue('payment.sepa_accepted', !values?.payment?.sepa_accepted)
  }

  return (
    <>
      <StepHeader title={t('CONTRIBUTION')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: t('WELCOME', {
            name: values?.member.is_member
              ? values.member.full_name
              : `${values.member.name} ${values.member.surname1}`
          })
        }}
      />

      <Box pt={1}>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('CONTRIBUTION_REMEMBER', {
              min: new Intl.NumberFormat('ca').format(
                contributionParams?.minContribution
              ),
              max: new Intl.NumberFormat('ca').format(
                contributionParams?.maxContribution
              ),
              step: new Intl.NumberFormat('ca').format(
                contributionParams?.contributionStep
              )
            })
          }}
        />
      </Box>

      <Box pt={1}>
        <Typography
          variant="h6"
          sx={{ mt: 2, pb: 1 }}
          dangerouslySetInnerHTML={{
            __html: t('CONTRIBUTION_AMOUNT_TITLE', {
              name: values.member.full_name
            })
          }}
        />

        <TextField
          required
          id="amount"
          name="payment.amount"
          variant="outlined"
          sx={{
            '& path': {
              color: 'secondary.dark'
            }
          }}
          fullWidth
          label={t('CONTRIBUTION_AMOUNT')}
          value={values?.payment?.amount}
          margin="normal"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.payment?.amount && touched?.payment?.amount}
          helperText={
            (touched?.payment?.amount && errors?.payment?.amount) ||
            t('CONTRIBUTION_AMOUNT_HELPER')
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EuroIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Box pt={1} mb={0}>
        <Typography
          variant="h6"
          sx={{ mt: 2, pb: 1, mb: 2 }}
          dangerouslySetInnerHTML={{
            __html: t('CONTRIBUTION_IBAN_TITLE', {
              name: values.member.full_name
            })
          }}
        />
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
      <Box mt={2} mb={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values?.payment?.sepa_accepted}
              onClick={handleClickSepa}
              color="primary"
              value={true}
            />
          }
          label={t('IBAN_ACCEPT_DIRECT_DEBIT')}
        />
      </Box>
    </>
  )
}

export default ContributionDetails
