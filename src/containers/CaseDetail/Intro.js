import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const useStyles = makeStyles((theme) => ({
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
  stepLabel: {
    fontSize: '1.5rem',
    color: 'red'
  },
  paperContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  }
}))

export default function ModifyIntro({ nextStep, prevStep, handleStepChanges }) {
  const { t } = useTranslation()
  const classes = useStyles()

  const onNextStep = (event) => {
    event.preventDefault()
    nextStep()
  }

  const onPrevStep = (event) => {
    event.preventDefault()
    prevStep()
  }

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Box mx={1}>
        <Typography
          variant="body1"
          component="div"
          dangerouslySetInnerHTML={{
            __html: t('MODIFY_POTTAR_INTRO', {
              url: t('MODIFY_POTTAR_INTRO_URL')
            })
          }}
        />
        <div className={classes.actionsContainer}>
          {prevStep && (
            <Button
              className={classes.button}
              startIcon={<ArrowBackIosIcon />}
              onClick={(event) => onPrevStep(event)}>
              {t('PAS_ANTERIOR')}
            </Button>
          )}
          {nextStep && (
            <Button
              type="submit"
              className={classes.button}
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
              onClick={(event) => onNextStep(event)}>
              {t('SEGUENT_PAS')}
            </Button>
          )}
        </div>
      </Box>
    </Paper>
  )
}
