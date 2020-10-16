import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import { modifyContract } from '../../services/api'
import { normalizeModifyData } from '../../services/utils'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
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
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between'
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
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}))

export default function ModifyResume ({ prevStep, nextStep, handleStepChanges, postSubmit, params, d1CaseData = false }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    setSending(true)
    await postSubmit(params)
    setSending(false)
  }

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Box mt={1} mx={1} mb={2}>
        <Typography gutterBottom>
          {t('REVIEW_DATA_AND_CONFIRM')}
        </Typography>
      </Box>

      <Box mx={1} mb={1}>
        <Divider />
      </Box>
      {
        console.log(d1CaseData)
      }
      { d1CaseData?.subsection &&
      <Box mt={2} mx={1}>
        <Typography className={classes.resumeLabel} variant="subtitle2" gutterBottom>
          {t('SUBSECTION_AUTO')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Typography data-cy="tariff" variant="body1" gutterBottom>
              {d1CaseData?.subsection}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      }

      { params.modify?.phases &&
        <Box mt={2} mx={1}>
          <Typography className={classes.resumeLabel} variant="subtitle2" gutterBottom>
            {t('INSTALL_TYPE')}
          </Typography>
          <Typography data-cy={params.modify?.phases} variant="body1" gutterBottom>
            {(params.modify?.phases === 'mono') ? t('MONOFASICA_NORMAL') : t('TRIFASICA')}
          </Typography>
        </Box>
      }
      { params.modify?.power &&
        <Box mt={2} mx={1}>
          <Grid container spacing={4}>
            <Grid item>
              <Typography className={classes.resumeLabel} variant="subtitle2" gutterBottom>
                {t('POWER')}{(params?.modify?.moreThan15Kw ? ' P1' : null)}
              </Typography>
              <Typography data-cy="power" variant="body1" gutterBottom>
                {params.modify?.power} kW
              </Typography>
            </Grid>
            { params?.modify?.moreThan15Kw &&
            <Grid item>
              <Typography className={classes.resumeLabel} variant="subtitle2" gutterBottom>
                {t('POWER')} P2
              </Typography>
              <Typography data-cy="power2" variant="body1" gutterBottom>
                {params.modify?.power2} kW
              </Typography>
            </Grid>
            }
            { params?.modify?.moreThan15Kw &&
            <Grid item>
              <Typography className={classes.resumeLabel} variant="subtitle2" gutterBottom>
                {t('POWER')} P3
              </Typography>
              <Typography data-cy="power3" variant="body1" gutterBottom>
                {params.modify?.power3} kW
              </Typography>
            </Grid>
            }
          </Grid>
        </Box>
      }
      {
        console.log(params)
      }{
        (params.modify?.fare || params.modify?.moreThan15Kw) &&
        <Box mt={2} mx={1}>
          <Typography className={classes.resumeLabel} variant="subtitle2" gutterBottom>
            {t('FARE')}
          </Typography>
          <Grid container spacing={2}>
            { params.modify?.tariff &&
              <Grid item>
                <Typography data-cy="tariff" variant="body1" gutterBottom>
                  {params.modify?.tariff}
                </Typography>
              </Grid>
            }
            { params.modify?.fare &&
              <Grid item>
                <Typography data-cy={params.modify?.fare} variant="body1" gutterBottom>
                  {(params.modify?.fare === 'dh') ? t('AMB_DISCRIMINACIO_HORARIA') : t('SENSE_DISCRIMINACIO_HORARIA')}
                </Typography>
              </Grid>
            }
          </Grid>
        </Box>
      }
      <Box mt={2} mb={3} mx={1}>
        <Typography className={classes.resumeLabel} variant="subtitle2">
          {t('CONTACT_PHONE')}
        </Typography>
        <Typography data-cy="contact" variant="body1" gutterBottom>
          {params.contact?.phone} ({params.contact?.contactName} {params.contact?.contactSurname})
        </Typography>
      </Box>

      <Box mt={1} mx={1} mb={2}>
        <Typography gutterBottom>
          {t('REVIEW_DATA_INFO')}
        </Typography>
      </Box>

      <Box mx={1} mb={1}>
        <Divider />
      </Box>

      <div className={classes.actionsContainer}>
        {
          prevStep &&
          <Button
            onClick={prevStep}
            className={classes.button}
            startIcon={<ArrowBackIosIcon />}
          >
            {t('PAS_ANTERIOR')}
          </Button>
        }
        {
          <>
            <Button
              type="submit"
              onClick={handleSubmit}
              className={classes.button}
              color="primary"
              variant="contained"
              startIcon={ sending ? <CircularProgress size={24} /> : <SendIcon /> }
              disabled={sending}
            >
              {t('ENVIAR')}
            </Button>
          </>
        }
      </div>
    </Paper>
  )
}
