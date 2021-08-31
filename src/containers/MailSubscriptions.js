import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import OptionSwitch from '../components/OptionSwitch'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#f2f2f2'
  },
  subsPaper: {
    padding: '16px 0'
  },
  controls: {
    textAlign: 'right',
    marginTop: '8px',
    marginBottom: '16px'
  },
  button: {
    paddingLeft: '64px',
    paddingRight: '64px'
  },
  emptyList: {
    padding: '32px'
  }
}))

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
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const { mailLists = defaultLists } = props

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  return (
    <div className={classes.root}>
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
              <Grid item xs={12} className={classes.controls}>
                <Button
                  className={classes.button}
                  variant="contained"
                  disableElevation
                  color="primary">
                  {t('DESAR')}
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <div className={classes.emptyList}>{t('NO_MAIL_LISTS')}</div>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  )
}

export default MailSubscriptions
