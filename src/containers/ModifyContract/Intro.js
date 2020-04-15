import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

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
  },
  stepLabel: {
    fontSize: '1.5rem',
    color: 'red'
  }
}))

export default function ModifyIntro ( { nextStep, prevStep } ) {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <div>
      <Box mx={1}>
        <Typography
          dangerouslySetInnerHTML={{ __html: t('MODIFY_POTTAR_INTRO') }}
        />
      </Box>
      <div className={classes.actionsContainer}>
        {
          prevStep &&
          <Button
            onClick={prevStep}
            className={classes.button}
            variant="contained"
          >
            {t('PAS_ANTERIOR')}
          </Button>
        }
        {
          nextStep &&
          <Button
            onClick={nextStep}
            className={classes.button}
            variant="contained"
            color="primary"
          >
            {t('SEGUENT_PAS')}
          </Button>
        }
      </div>
    </div>
  )
}
