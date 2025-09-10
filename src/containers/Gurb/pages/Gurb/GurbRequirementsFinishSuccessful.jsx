import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'


const GurbRequirementsFinishSuccessful = (props) => {

  const { i18n } = useTranslation()
  const { language } = useParams()
  const { t } = useTranslation()
  const { values } = props

  const title = t('GURB_REQUIREMENTS_FORM_FINISH_TITLE')
  const description = t('GURB_REQUIREMENTS_FORM_FINISH_DESCRIPTION')

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
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

      {title ? (
        <Typography sx={{ fontWeight: 'bold' }} variant="h6">
            {t(title)}
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
            ? t(description)
            : t('SUCCESS_NOTE')
        }}
      />
    </Box>
  )
}

export default GurbRequirementsFinishSuccessful
