import React, { useEffect } from 'react'
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

export default function ModifyIntro ({ nextStep, prevStep }) {
  const { t } = useTranslation()
  const classes = useStyles()

  const onFormSubmit = event => {
    console.log('submit!')
    event.preventDefault()
    nextStep()
  }

  useEffect(() => {
    const listener = event => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        onFormSubmit(event)
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [])

  return (
    <div>
      <Box mx={1}>
        <form onSubmit={onFormSubmit}>
          <Typography
            dangerouslySetInnerHTML={{ __html: t('MODIFY_POTTAR_INTRO') }}
          />
          <div className={classes.actionsContainer}>
            {
              nextStep &&
              <Button
                type="submit"
                className={classes.button}
                variant="contained"
                color="primary"
              >
                {t('SEGUENT_PAS')}
              </Button>
            }
          </div>
        </form>
      </Box>
    </div>
  )
}
