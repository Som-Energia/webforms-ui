import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import SendIcon from '@material-ui/icons/Send'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}))

export default function ModifyResume ({ prevStep, nextStep, params }) {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <div>
      <Box mt={2} mx={1}>
        <Typography variant="h6" gutterBottom>
          {t('MODIFY_POTTAR')}
        </Typography>
        <Typography gutterBottom>
          {t('REVIEW_DATA_AND_CONFIRM')}
        </Typography>
      </Box>
      <Box mt={2} mx={1}>
        <Typography variant="subtitle2">
          {t('FARE')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {params?.modify?.fare}
        </Typography>
      </Box>
      <Box mt={2} mx={1}>
        <Typography variant="subtitle2">
          {t('POWER')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {params?.modify?.power} kW
        </Typography>
      </Box>
      <Box mt={2} mb={2} mx={1}>
        <Typography variant="subtitle2">
          {t('CONTACT_PHONE')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {params?.contact?.phone}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {params?.contact?.name} {params?.contact?.surname}
        </Typography>
      </Box>
      <div className={classes.actionsContainer}>
        {
          prevStep &&
          <Button
            onClick={prevStep}
            className={classes.button}
          >
            {t('PAS_ANTERIOR')}
          </Button>
        }
        {
          nextStep &&
          <Button
            onClick={nextStep}
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<SendIcon />}
          >
            {t('ENVIAR')}
          </Button>
        }
      </div>
    </div>
  )
}
