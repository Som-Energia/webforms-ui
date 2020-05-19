import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  title: {
    marginBottom: theme.spacing(3),
    color: '#96b633',
    textTransform: 'uppercase',
    fontWeight: 500
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: '25ch'
  }
}))

const Review = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { validate } = props

  return (
    <>
      <StepHeader title={t('REVIEW_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
      />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{t('SUMMARY_GROUP_PROCESS')}</Typography>
          <div>
            <Typography variant="subtitle2">{t('SUMMARY_GROUP_PROCESS')}</Typography>
            <Typography variant="body2">{t('SUMMARY_GROUP_PROCESS')}</Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{t('SUPPLY')}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{t('HOLDER')}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{t('CONTACT')}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{t('SUMMARY_GROUP_TECHNICAL')}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{t('SUMMARY_GROUP_PAYMENT')}</Typography>
        </Grid>
      </Grid>
      <Box mt={4} mb={3}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
            />
          }
          label={t('ACCEPT_TERMS')}
        />
      </Box>
    </>
  )
}

export default Review
