import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import StepHeader from '../components/StepHeader'

const Success = (props) => {
  const { result, description, title, showHeader, subtitle } = props
  const { language } = useParams()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  return (
    <>
      {showHeader && <StepHeader title={t('SUCCESS_TITLE')} />}
      <Box
        sx={{
          pt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <CheckCircleIcon
          data-cy="success-icon"
          fontSize="large"
          sx={{ mb: 3, color: 'primary.extraLight' }}
        />

        <Typography
          id="success-page-title"
          sx={{
            textAlign: 'center',
            fontSize: '1.15rem'
          }}
          variant="h6">
          {title ? t(title) : t('SUCCESS_TEXT')}
        </Typography>

        {subtitle ? (
          <Typography sx={{ fontWeight: 'bold' }} variant="h6">
            {t(subtitle)}
          </Typography>
        ) : null}

        <Typography
          sx={{
            mt: 2,
            fontWeight: '400',
            fontSize: '1rem',
            lineHeight: '1.75',
            textAlign: 'center',
            color: 'secondary.extraDark'
          }}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: description
              ? t(description, result)
              : t('SUCCESS_NOTE', result)
          }}
        />
      </Box>
    </>
  )
}

export default Success
