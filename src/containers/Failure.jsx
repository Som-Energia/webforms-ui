import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CancelIcon from '@mui/icons-material/Cancel'

import StepHeader from '../components/StepHeader'

function Failure(props) {
  const { language } = useParams()
  const { t, i18n } = useTranslation()

  const {
    error = false,
    description = 'NEWMEMBER_KO_DESCRIPTION',
    showHeader
  } = props

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  return (
    <>
      {showHeader && <StepHeader title={t('FAILURE_TITLE')} />}
      <Box
        sx={{
          pt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <CancelIcon
          data-cy="error-icon"
          fontSize="large"
          sx={{ mb: 3, color: 'primary2.main' }}
        />
        <Typography
          sx={{ textAlign: 'center', fontSize: '1.15rem' }}
          variant="h6">
          {t('FAILURE_TEXT')}
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontWeight: '400',
            fontSize: '1rem',
            lineHeight: '1.75',
            textAlign: 'center',
            color: 'secondary.extraDark',
            '& a': {
              color: 'failure.primary !important'
            }
          }}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html:
              error?.code === undefined
                ? t(description, { url: t('CONTACT_HELP_URL') })
                : error?.code === 'INVALID_FIELD' && error?.data?.[0]?.field
                ? i18n.exists(error?.data?.[0]?.field.toUpperCase())
                  ? t(error?.data?.[0]?.field.toUpperCase())
                  : t('INVALID_FIELD', { field_name: error?.data?.[0]?.field })
                : error?.code === 'INVOICE_ERROR'
                ? error?.error
                : t('UNEXPECTED_POSTERROR', {
                    error_message: error?.code ? t(error?.code) : error?.error
                  })
          }}
        />
      </Box>
    </>
  )
}

export default Failure
