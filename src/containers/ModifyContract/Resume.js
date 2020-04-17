import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import { modifyContract } from '../../services/api'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
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

export default function ModifyResume ({ prevStep, nextStep, handleStepChanges, params }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleSubmit = event => {
    console.log('final submit!')
    modifyContract(params)
      .then(response => {
        console.log('response 2')
        console.log(response)
        handleStepChanges({ response: response.data })
        nextStep()
      })
      .catch(error => {
        console.log('error catch!')
        console.log(error)
        handleStepChanges({ error: error?.response?.data?.error })
        nextStep()
      })
  }

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Box mt={2} mx={1} mb={2}>
        <Typography gutterBottom>
          {t('REVIEW_DATA_AND_CONFIRM')}
        </Typography>
      </Box>
      { params.modify?.phases &&
        <Box mt={2} mx={1}>
          <Typography variant="subtitle2">
            {t('TIPUS_INSTALLACIO')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {(params.modify?.phases === 'mono') ? t('MONOFASICA_NORMAL') : t('TRIFASICA')}
          </Typography>
        </Box>
      }
      { params.modify?.power &&
        <Box mt={2} mx={1}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="subtitle2">
                {t('POWER')}{(params?.modify?.moreThan15Kw ? ' P1' : null)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {params.modify?.power} kW
              </Typography>
            </Grid>
            { params?.modify?.moreThan15Kw &&
            <Grid item>
              <Typography variant="subtitle2">
                {t('POWER')} P2
              </Typography>
              <Typography variant="body1" gutterBottom>
                {params.modify?.power2} kW
              </Typography>
            </Grid>
            }
            { params?.modify?.moreThan15Kw &&
            <Grid item>
              <Typography variant="subtitle2">
                {t('POWER')} P3
              </Typography>
              <Typography variant="body1" gutterBottom>
                {params.modify?.power3} kW
              </Typography>
            </Grid>
            }
          </Grid>
        </Box>
      }
      { params.modify?.fare &&
        <Box mt={2} mx={1}>
          <Typography variant="subtitle2">
            {t('FARE')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {(params.modify?.fare === 'dh') ? t('AMB_DISCRIMINACIO_HORARIA') : t('SENSE_DISCRIMINACIO_HORARIA')}
          </Typography>
        </Box>
      }
      <Box mt={2} mb={3} mx={1}>
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
