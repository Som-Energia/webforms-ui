import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import Result from '../../Result'

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
    color: 'secondary.extraDark',
    '& a': {
      color: 'failure.primary !important'
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
    color: 'failure.primary',
    backgroundColor: 'transparent',
    border: '2px solid',
    borderColor: 'failure.primary',
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
        <Result
          mode={'failure'}
          {...props}
          title={t('FAILURE_TEXT')}
          description={t('INDEXED_UNEXPECTED_ERROR_TXT')}
        />
      </Box>
    </>
  )
}

export default GenerationFailure