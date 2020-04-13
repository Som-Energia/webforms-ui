import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import { Typography, Grid, Box } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

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

export default function ModifyResume ({ prevStep, nextStep }) {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <div>
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
          >
            {t('ENVIAR')}
          </Button>
        }
      </div>
    </div>
  )
}
