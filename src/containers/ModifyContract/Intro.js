import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

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
    justifyContent: 'flex-end'
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
  },
  warningMessage: {
    '& p': {
      marginTop: 0,
      marginBottom: '8px'
    },
    '& a': {
      color: theme.palette.primary.dark
    }
  }
}))

export default function ModifyIntro({ nextStep, prevStep }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [isSubmitting, setSubmitting] = useState(false)

  const [adviceOpen, setAdviceOpen] = useState(true)

  const onFormSubmit = (event) => {
    event.preventDefault()
    if (!isSubmitting) {
      setSubmitting(true)
      nextStep()
    }
  }

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      <Box mx={1}>
        <form onSubmit={onFormSubmit}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: t('MODIFY_POTTAR_INTRO', {
                url: t('MODIFY_POTTAR_INTRO_URL')
              })
            }}
          />
          <div className={classes.actionsContainer}>
            {nextStep && (
              <Button
                type="submit"
                className={classes.button}
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIosIcon />}
                disabled={isSubmitting}>
                {t('SEGUENT_PAS')}
              </Button>
            )}
          </div>
        </form>
      </Box>
      <Dialog
        open={adviceOpen}
        onClose={() => setAdviceOpen(false)}
        maxWidth="md">
        <DialogTitle>⚠️&nbsp;&nbsp;{t('WARNING_NP_TITLE')}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText>
            <Typography
              className={classes.warningMessage}
              dangerouslySetInnerHTML={{
                __html: t('MODIFY_NP_ADVICE')
              }}></Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAdviceOpen(false)}
            color="primary"
            variant="contained">
            {t('I_ACCEPT')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
