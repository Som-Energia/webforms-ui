import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import OptionSwitch from '../components/oficinavirtual/OptionSwitch'
import { useSyncLanguage } from '../hooks/useTranslateOptions'

import Box from '@mui/material/Box'

const defaultLists = [
  { title: 'BLOG_NEWS', description: 'BLOG_NEWS_DESC', value: true },
  {
    title: 'PRESS_RELEASES',
    description: 'PRESS_RELEASES_DESC',
    value: false
  },
  {
    title: 'PARTNER_NEWS',
    description: 'PARTNER_NEWS_DESC',
    value: false
  },
  {
    title: 'COLLECTIVE_PURCHASES',
    description: 'COLLECTIVE_PURCHASES_DESC',
    value: false
  }
]

const MailSubscriptions = (props) => {
  const { t, i18n } = useTranslation()
  const { mailLists = defaultLists } = props
  const { language } = useParams()

  useSyncLanguage(language)

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f2f2f2' }}>
      <Container disableGutters>
        <Grid container spacing={1}>
          {mailLists.lenghth ? (
            <>
              {mailLists.map((mailList) => (
                <Grid key={mailList.title} item xs={12}>
                  <OptionSwitch
                    title={t(mailList.title)}
                    description={t(mailList.description)}
                    value={mailList.value}
                  />
                </Grid>
              ))}
              <Grid
                item
                xs={12}
                sx={{ textAlign: 'right', mt: '8px', mb: '16px' }}>
                <Button
                  sx={{ pl: '64px', pr: '64px' }}
                  variant="contained"
                  disableElevation
                  color="primary">
                  {t('DESAR')}
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Box sx={{ padding: '32px' }}>{t('NO_MAIL_LISTS')}</Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  )
}

export default MailSubscriptions
