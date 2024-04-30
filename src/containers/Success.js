import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import DoneIcon from '@mui/icons-material/Done'

import StepHeader from '../components/StepHeader'
import cuca from '../images/cuca.svg'
import { styled } from '@mui/system';


const StyledImg = styled('img')({
  width: '220px',
  m: 2
});


const Success = (props) => {
  const { result, description, title, showHeader, subtitle } = props
  const { language } = useParams()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <>
      {showHeader && <StepHeader title={t('SUCCESS_TITLE')} />}
      <Box sx={{
        pt: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Avatar sx={{
          width: 6,
          height: 6,
          color: 'primary.main',
          backgroundColor: 'transparent',
          border: `2px solid primary.main`,
          mb: 3
        }}>
          <DoneIcon fontSize="large" />
        </Avatar>

        <Typography id="success-page-title" sx={{
          textAlign: 'center',
          fontSize: '1.15rem'
        }} variant="h6">
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
            color: '#6f6262'
          }}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: description
              ? t(description, result)
              : t('SUCCESS_NOTE', result)
          }}
        />
        <Box mt={3} mb={1}>
          <StyledImg alt="Cuca de Som Energia" src={cuca} />
        </Box>
      </Box>
    </>
  )
}

export default Success
