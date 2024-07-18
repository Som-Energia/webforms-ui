import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { languages, NEW_MEMBER_CONTRIB_AMOUNT } from '../../../services/utils'

const customBoxContentStyles = {
  boxContent: {
    mt: '24px',
    mb: '10px',
    textAlign: 'justify'
  }
}

const Review = (props) => {
  const { t } = useTranslation()
  const { values, setFieldValue, title } = props

  const handleClickPrivacyPolicy = (event) => {
    event.preventDefault()
    setFieldValue(
      'privacy_policy_accepted_responsible_declaration',
      !values?.privacy_policy_accepted_responsible_declaration
    )
  }

  const ReviewField = useCallback(({ label, value }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
        <Box className="field__title">
          <Typography
            sx={{
              textTransform: 'uppercase',
              pr: '12px',
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.54)'
            }}
            variant="subtitle2">
            {label}
          </Typography>
        </Box>
        <Box className="field__value">
          <Typography sx={{ fontSize: '16px' }} variant="body2">
            {value}
          </Typography>
        </Box>
      </Box>
    )
  }, [])

  return (
    <>
      <Typography component="h1" variant="h3">
        {title}
      </Typography>

      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('GENERATION_FORM_REVIEW_DESC') }}
      />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography id="personal-data" component="h3" variant="h6">
            {values?.member?.is_member
              ? t('REVIEW_PERSONAL_DATA')
              : t('NEW_MEMBER')}
          </Typography>
          <ReviewField label={'NIF'} value={values?.member?.vat} />

          {values?.member?.is_member && (
            <>
              <ReviewField
                label={t('NUMERO_SOCI')}
                value={`${values?.member?.partner_number}`}
              />
            </>
          )}

          {!values?.member?.is_member && (
            <>
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
                value={`${values?.member?.city?.name} (${values?.member?.postal_code}) ${values?.member?.state?.name}`}
              />
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography component="h3" variant="h6">
            {t('CONTACT')}
          </Typography>
          {values?.member?.is_member ? (
            <Box dangerouslySetInnerHTML={{ __html: t('DATA_AS_IN_OV') }} />
          ) : (
            <>
              <ReviewField label={t('PHONE')} value={values?.member?.phone1} />
              <ReviewField label={t('EMAIL')} value={values?.member?.email} />
              <ReviewField
                label={t('LANGUAGE')}
                value={languages[values?.member?.language]}
              />
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={12}>
          <Divider variant="middle" sx={{ mt: '12px', ml: 0, mr: '32px' }} />
          <Typography component="h3" variant="h6">
            {t('SUMMARY_GROUP_PAYMENT')}
          </Typography>
          <ReviewField
            label={t('CONTRIBUTION_AMOUNT')}
            value={`${new Intl.NumberFormat('ca').format(
              values?.payment?.amount
            )} €`}
          />
          {!values?.member?.is_member && (
            <>
              <ReviewField
                label={t('CONTRIBUTION_NEW_MEMBER_CONTRIB')}
                value={`${new Intl.NumberFormat('ca').format(
                  NEW_MEMBER_CONTRIB_AMOUNT
                )} €`}
              />
              <ReviewField
                label={t('CONTRIBUTION_TOTAL_AMOUNT')}
                value={`${new Intl.NumberFormat('ca').format(
                  parseInt(NEW_MEMBER_CONTRIB_AMOUNT) +
                    parseInt(values?.payment?.amount)
                )} €`}
              />
            </>
          )}

          <ReviewField label={t('IBAN')} value={values?.payment?.iban} />

          <Divider variant="middle" sx={{ mt: '24px', ml: 0, mr: '32px' }} />
        </Grid>
      </Grid>

      <Box sx={customBoxContentStyles.boxContent}>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('GENERATION_FORM_REVIEW_RESPONSIBLE_STATEMENT')
          }}
        />
      </Box>

      <Box mt={2} mb={1} sx={customBoxContentStyles.boxContent}>
        <FormControlLabel
          control={
            <Checkbox
              id="privacy_plicy_check"
              checked={values?.privacy_policy_accepted_responsible_declaration}
              onClick={handleClickPrivacyPolicy}
              color="primary"
              value={true}
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('GENERATION_FORM_TERMS_RESPONSIBLE_STATEMENT', {
                  url: t('GENERATION_FORM_URL_PRIVACY_POLICY')
                })
              }}
            />
          }
        />
      </Box>

      <Box sx={customBoxContentStyles.boxContent}>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('GENERATION_FORM_REVIEW_SECONDARY_TEXT')
          }}
        />
      </Box>
    </>
  )
}

export default Review
