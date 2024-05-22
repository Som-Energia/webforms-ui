import React from 'react'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

import Header from '../../components/oficinavirtual/Header'
import Card from '../../components/oficinavirtual/Card'

const CancellationIntro = () => {
  const { t } = useTranslation()
  return (
    <Box sx={{
      position: 'relative',
      color: 'text.primary',
      'a': {
        textDecoration: 'none'
      }
    }}>
      <Header>{t('CANCELLATION_INTRO_TITLE')}</Header>
      <Card>
        <div
          dangerouslySetInnerHTML={{
            __html: t('CANCELLATION_INTRO_BODY', {
              url_new: t('FAQ_ALTA_SUMINISTRAMENT_URL'),
              url_holderchange: t('FAQ_HOLDERCHANGE_URL')
            })
          }}
        />
      </Card>
    </Box>
  )
}

export default CancellationIntro