import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
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
    marginBottom: theme.spacing(1)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  paperContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  }
}))

export default function ModifyResume ({ prevStep, nextStep, params }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleSubmit = event => {
    console.log('final submit!')
    console.log(params)
  }

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Box mt={2} mx={1}>
        <Typography gutterBottom>
          {t('REVIEW_DATA_AND_CONFIRM')}
        </Typography>
      </Box>
      { params.modify?.fare &&
        <Box mt={2} mx={1}>
          <Typography variant="subtitle2">
            {t('FARE')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {params.modify?.fare}
          </Typography>
        </Box>
      }
      { params.modify?.power &&
        <Box mt={2} mx={1}>
          <Typography variant="subtitle2">
            {t('POWER')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {params.modify?.power} kW
          </Typography>
        </Box>
      }
      <Box mt={2} mb={2} mx={1}>
        <Typography variant="subtitle2">
          {t('CONTACT_PHONE')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {params.contact?.phone} ({params.contact?.contact_name} {params.contact?.contact_surname})
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
            onClick={handleSubmit}
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<SendIcon />}
          >
            {t('ENVIAR')}
          </Button>
        }
      </div>
    </Paper>
  )
}
