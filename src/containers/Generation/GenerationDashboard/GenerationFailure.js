import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'

import cuca from '../../../images/cuca-marejada.svg'


const customStyles ={
  container: {
    pt: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  message: {
    mt: 2,
    fontWeight: '400',
    fontSize: '1rem',
    lineHeight: '1.75',
    textAlign: 'center',
    color: '#6f6262',
    '& a': {
      color: '#fe6444 !important'
    }
  },
  logo: {
    width: '220px',
    margin: 2
  },
  title: {
    textAlign: 'center',
    fontSize: '1.15rem'
  },
  error: {
    width: 6,
    height: 6,
    color: '#fe6444',
    backgroundColor: 'transparent',
    border: '2px solid #fe6444',
    mb: 3
  }
}

function GenerationFailure(props) {
  const { language } = useParams()
  const { t, i18n } = useTranslation()
  

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <>
      <Box sx={customStyles.container}>
        <Avatar sx={customStyles.error}>
          <CloseIcon fontSize="large" />
        </Avatar>
        <Typography sx={customStyles.title} variant="h6">
          {t('FAILURE_TEXT')}
        </Typography>
        <Typography
          sx={customStyles.message}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html:
            t('INDEXED_UNEXPECTED_ERROR_TXT', {url: t('CONTACT_HELP_URL')})
          }}
        />
        <Box mt={3} mb={1}>
          <img
            sx={customStyles.logo}
            alt="Cuca KO de Som Energia"
            src={cuca}
          />
        </Box>
      </Box>
    </>
  )
}

export default GenerationFailure