import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SendIcon from '@material-ui/icons/Send'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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
  }
}))

function AcceptD1 ({ prevStep, handlePost, handleRefuseClick, handleStepChanges, params }) {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Paper className={classes.paperContainer} elevation={0}>

      { params?.to_validate && <>
        <Box mt={1} mx={1} mb={2}>
          <Typography variant="body1"
            dangerouslySetInnerHTML={{ __html: t('REVIEW_DATA_D1') }}
          />
        </Box>
        <Box mx={1} mb={1}>
          <Divider />
        </Box>
      </> }

      <Box mx={1} mb={4}>
      </Box>

      <div className={classes.actionsContainer}>
        {
          <Button
            data-cy="prev"
            className={classes.button}
            startIcon={<ArrowBackIosIcon />}
            disabled={params?.sending}
            onClick={() => prevStep(params)}
          >
            {t('PAS_ANTERIOR')}
          </Button>
        }
        {
          <>
            <Button
              type="submit"
              onClick={event => handlePost(event, params)}
              className={classes.button}
              color="primary"
              variant="contained"
              startIcon={<CheckCircleOutlineIcon />}
            >
              {t('ACCEPTAR')}
            </Button>
          </>
        }
      </div>

    </Paper>
  )
}

export default AcceptD1
