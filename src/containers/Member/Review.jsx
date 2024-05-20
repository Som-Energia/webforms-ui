import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import StepHeader from '../../components/StepHeader'

import { languages } from '../../services/utils'

const Review = (props) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = props

  const handleClick = (event) => {
    event.preventDefault()
    setFieldValue('terms_accepted', !values.terms_accepted)
  }

  const ReviewField = ({ label, value }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 0.8
        }}>
        <Box className="field__title">
          <Typography
            sx={{
              textTransform: 'uppercase',
              pr: 2,
              color: 'secondary.dark'
            }}
            variant="subtitle2">
            {label}
          </Typography>
        </Box>
        <Box className="field__value">
          <Typography variant="body1">
            {value}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <StepHeader title={t('REVIEW_MEMBER_TITLE')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
      />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              textTransform: 'uppercase',
              mt: 3,
              mb: 1.2
            }}
            variant="h6">
            {t('NEW_MEMBER')}
          </Typography>
          <ReviewField label={'NIF'} value={values?.member?.vat} />
          {values?.member?.isphisical ? (
            <>
              <ReviewField
                label={t('NAME')}
                value={`${values?.member?.name} ${values?.member?.surname1} ${values?.member?.surname2}`}
              />
            </>
          ) : (
            <>
              <ReviewField
                label={t('LEGAL_NAME')}
                value={values?.member?.name}
              />
              <ReviewField
                label={t('PROXY')}
                value={`${values?.member.proxyname} (${values?.member?.proxynif})`}
              />
            </>
          )}
          <ReviewField
            label={t('ADDRESS')}
            value={`${values?.member?.address}, ${values?.member?.number} ${
              values?.member?.floor || ''
            } ${values?.member?.door || ''}`}
          />
          <ReviewField
            label={t('CITY')}
            value={`${values?.member?.city.name} (${values?.member?.postal_code}) ${values?.member?.state.name}`}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              textTransform: 'uppercase',
              mt: 3,
              mb: 1.2
            }}
            variant="h6">
            {t('CONTACT')}
          </Typography>
          <ReviewField label={t('PHONE')} value={values?.member?.phone1} />
          <ReviewField label={t('EMAIL')} value={values?.member?.email} />
          <ReviewField
            label={t('LANGUAGE')}
            value={languages[values?.member?.language]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Divider
            variant="middle"
            sx={{
              mt: 1.5,
              ml: 0,
              mr: 2
            }}
          />
          <Typography
            sx={{
              textTransform: 'uppercase',
              mt: 3,
              mb: 1.2
            }}
            variant="h6">
            {t('SUMMARY_GROUP_PAYMENT')}
          </Typography>
          <ReviewField
            label={t('PAYMENT_METHOD')}
            value={t(values?.payment?.payment_method.toUpperCase())}
          />
          {values?.payment?.payment_method === 'iban' && (
            <ReviewField label={t('IBAN')} value={values?.payment?.iban} />
          )}
          <Divider
            variant="middle"
            sx={{
              mt: 1.5,
              ml: 0,
              mr: 2
            }}
          />
        </Grid>
      </Grid>

      <Box mt={2}>
        <FormControlLabel
          control={
            <Checkbox
              name="terms_accepted"
              onClick={handleClick}
              checked={values.terms_accepted}
              color="primary"
            />
          }
          label={t('ACCEPT_TERMS')}
        />
      </Box>
    </>
  )
}

export default Review
