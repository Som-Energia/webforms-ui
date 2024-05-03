import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { styled } from '@mui/system'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'

import StepHeader from '../../components/StepHeader'
import cuca from '../../images/cuca-marejada.svg'
import indexedErrorText from './IndexedError'

const StyledImg = styled('img')({
  width: '220px',
  m: 2
})

function Failure(props) {
  const { language } = useParams()
  const { t, i18n } = useTranslation()
  const { error = false, showHeader = true } = props

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <>
      {showHeader && <StepHeader title={t('FAILURE_TITLE')} />}
      <Box
        sx={{
          pt: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Avatar
          sx={{
            width: 6,
            height: 6,
            color: '#fe6444',
            backgroundColor: 'transparent',
            border: '2px solid #fe6444',
            mb: 3
          }}>
          <CloseIcon fontSize="large" />
        </Avatar>
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
            color: '#6f6262',
            '& a': {
              color: '#fe6444 !important'
            }
          }}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: indexedErrorText(t, error.code, error.data)
          }}
        />
        <Box mt={3} mb={1}>
          <StyledImg alt="Cuca KO de Som Energia" src={cuca} />
        </Box>
      </Box>
    </>
  )
}

export default Failure
