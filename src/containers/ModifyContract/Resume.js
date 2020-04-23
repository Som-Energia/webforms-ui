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
  },
  resumeLabel: {
    textTransform: 'uppercase'
  }
}))

export default function ModifyResume ({ prevStep, nextStep, handleStepChanges, params }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleSubmit = () => {
    console.log('final submit!')
    console.log(params)

    const { modify, contact, token } = params
    const THOUSANDS_CONVERSION_FACTOR = 1000

    const data = {
      tarifa: modify?.rate,
      potencia: modify?.changePower ? Math.round(modify?.power * THOUSANDS_CONVERSION_FACTOR) : undefined,
      potencia_p2: modify?.changePower && modify?.moreThan15Kw ? Math.round(modify?.power2 * THOUSANDS_CONVERSION_FACTOR) : undefined,
      potencia_p3: modify?.changePower && modify?.moreThan15Kw ? Math.round(modify?.power3 * THOUSANDS_CONVERSION_FACTOR) : undefined,
      contact_name: contact?.contactName,
      contact_surname: contact?.contactSurname,
      contact_phone: contact?.phone,
      token: token
    }

    console.log(data)

    modifyContract(data)
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
      <Box mt={1} mx={1} mb={3}>
        <Typography gutterBottom>
          {t('REVIEW_DATA_AND_CONFIRM')}
        </Typography>
      </Box>
      { params.modify?.phases &&
        <Box mt={2} mx={1}>
          <Typography className={classes.resumeLabel} variant="subtitle2">
            {t('TIPUS_INSTALLACIO')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {(params.modify?.phases === 'mono') ? t('MONOFASICA_NORMAL') : t('TRIFASICA')}
          </Typography>
        </Box>
      }
      { params.modify?.power &&
        <Box mt={2} mx={1}>
          <Grid container spacing={4}>
            <Grid item>
              <Typography className={classes.resumeLabel} variant="subtitle2">
                {t('POWER')}{(params?.modify?.moreThan15Kw ? ' P1' : null)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {params.modify?.power} kW
              </Typography>
            </Grid>
            { params?.modify?.moreThan15Kw &&
            <Grid item>
              <Typography className={classes.resumeLabel} variant="subtitle2">
                {t('POWER')} P2
              </Typography>
              <Typography variant="body1" gutterBottom>
                {params.modify?.power2} kW
              </Typography>
            </Grid>
            }
            { params?.modify?.moreThan15Kw &&
            <Grid item>
              <Typography className={classes.resumeLabel} variant="subtitle2">
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
          <Typography className={classes.resumeLabel} variant="subtitle2">
            {t('FARE')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {(params.modify?.fare === 'dh') ? t('AMB_DISCRIMINACIO_HORARIA') : t('SENSE_DISCRIMINACIO_HORARIA')}
          </Typography>
        </Box>
      }
      <Box mt={2} mb={3} mx={1}>
        <Typography className={classes.resumeLabel} variant="subtitle2">
          {t('CONTACT_PHONE')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {params.contact?.phone} ({params.contact?.contactName} {params.contact?.contactSurname})
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
