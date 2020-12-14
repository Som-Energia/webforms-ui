import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import OptionSwitch from '../components/OptionSwitch'

import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: '#f2f2f2'
  },
  subsPaper: {
    padding: '16px 32px'
  },
  controls: {
    textAlign: 'right',
    marginTop: '8px',
    marginBottom: '16px'
  },
  button: {
    paddingLeft: '64px',
    paddingRight: '64px'
  }
}))

const Subscriptions = () => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className={classes.subsPaper} elevation={0}>
              <Typography variant="h3">{ t('SUBSCRIPTIONS_TITLE') }</Typography>
              <Typography variant="subtitle1">{ t('SUBSCRIPTIONS_DESC') }</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <OptionSwitch
              title={t('BLOG_NEWS')}
              description={t('BLOG_NEWS_DESC')}
            />
          </Grid>
          <Grid item xs={12}>
            <OptionSwitch
              title={t('BLOG_LOCALS_NEWS')}
              description={t('BLOG_LOCALS_NEWS_DESC')}
            />
          </Grid>
          <Grid item xs={12}>
            <OptionSwitch
              title={t('PRESS_RELEASES')}
              description={t('PRESS_RELEASES_DESC')}
            />
          </Grid>
          <Grid item xs={12}>
            <OptionSwitch
              title={t('PARTNER_NEWS')}
              description={t('PARTNER_NEWS_DESC')}
            />
          </Grid>
          <Grid item xs={12}>
            <OptionSwitch
              title={t('COLLECTIVE_PURCHASES')}
              description={t('COLLECTIVE_PURCHASES_DESC')}
            />
          </Grid>
          <Grid item xs={12} className={classes.controls}>
            <Button className={classes.button} variant="contained" color="primary">
              { t('DESAR') }
            </Button>
          </Grid>

        </Grid>
      </Container>
    </div>
  )
}

export default Subscriptions
