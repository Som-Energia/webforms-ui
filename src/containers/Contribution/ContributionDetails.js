import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import StepHeader from '../../components/StepHeader'
import IBANField from '../../components/IBANField'
import TermsDialog from '../../components/TermsDialog'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import EuroIcon from '@material-ui/icons/EuroRounded'

import { contributionParams } from '../../services/utils'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1rem',
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  },
  titleWithMargin: {
    marginBottom: theme.spacing(2)
  },
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
}))

const ContributionDetails = (props) => {
  const { values, handleChange, handleBlur, errors, touched, setFieldValue } =
    props
  const { t } = useTranslation()
  const classes = useStyles()

  const [open, setOpen] = useState(false)

  console.log(contributionParams)

  const handleIBANChange = ({ IBAN, IBANValid }) => {
    setFieldValue('contribution.iban', IBAN, false)
    setFieldValue('contribution.iban_valid', IBANValid)
  }

  const handleClickTerms = (event) => {
    event.preventDefault()
    setFieldValue(
      'contribution.terms_accepted',
      !values?.contribution?.terms_accepted
    )
  }

  const handleClickSepa = () => {
    setOpen(true)
  }

  const handleAccept = () => {
    setFieldValue('contribution.sepa_accepted', true)
    setOpen(false)
  }

  const handleClose = () => {
    setFieldValue('contribution.sepa_accepted', false)
    setOpen(false)
  }

  return (
    <>
      <StepHeader title={t('CONTRIBUTION')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: t('WELCOME', { name: values.member.full_name })
        }}
      />

      <Box pt={1}>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('CONTRIBUTION_REMEMBER', {
              min: new Intl.NumberFormat('es-ES').format(
                contributionParams?.minContribution
              ),
              max: new Intl.NumberFormat('es-ES').format(
                contributionParams?.maxContribution
              ),
              step: new Intl.NumberFormat('es-ES').format(
                contributionParams?.contributionStep
              )
            })
          }}
        />
      </Box>

      <Box pt={1}>
        <Typography
          variant="h6"
          className={classes.title}
          dangerouslySetInnerHTML={{
            __html: t('CONTRIBUTION_AMOUNT_TITLE', {
              name: values.member.full_name
            })
          }}
        />

        <TextField
          required
          id="amount"
          name="contribution.amount"
          variant="outlined"
          className={classes.icon}
          fullWidth
          label={t('CONTRIBUTION_AMOUNT')}
          value={values?.contribution?.amount}
          margin="normal"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.contribution?.amount && touched?.contribution?.amount}
          helperText={
            t('CONTRIBUTION_AMOUNT_HELPER') ||
            (touched?.contribution?.amount && errors?.contribution?.amount)
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
          className={`${classes.title} ${classes.titleWithMargin}`}
          dangerouslySetInnerHTML={{
            __html: t('CONTRIBUTION_IBAN_TITLE', {
              name: values.member.full_name
            })
          }}
        />
        <IBANField
          id="iban"
          name="contribution.iban"
          label={t('IBAN_LABEL')}
          onChange={handleIBANChange}
          onBlur={handleBlur}
          value={values?.contribution?.iban}
          error={
            (errors?.contribution?.iban || errors?.contribution?.iban_valid) &&
            touched?.contribution?.iban
          }
          helperText={
            (touched?.contribution?.iban &&
              (errors?.contribution?.iban ||
                errors?.contribution?.iban_valid)) ||
            t('IBAN_HELP')
          }
          variant="outlined"
        />
      </Box>
      <Box mt={2} mb={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values?.contribution?.sepa_accepted}
              onClick={handleClickSepa}
              color="primary"
              value={true}
            />
          }
          label={t('IBAN_ACCEPT_DIRECT_DEBIT')}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={values?.contribution?.terms_accepted}
              onClick={handleClickTerms}
              color="primary"
              value={true}
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('CONTRIBUTION_GENERAL_TERMS', {
                  url: t('CONTRIBUTION_GENERAL_TERMS_URL')
                })
              }}
            />
          }
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
  )
}

export default ContributionDetails
