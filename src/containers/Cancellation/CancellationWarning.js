import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Alert from '@material-ui/lab/Alert'
import Typography from '@material-ui/core/Typography'

const CancellationWarning = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Box mt={0.75} mb={1.5}>
      <Alert severity="warning">
        <Typography
          className={classes.disclaimer}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('CANCELLATION_DISCLAIMER')
          }}
        />
      </Alert>
    </Box>
  )
}

export default CancellationWarning

const useStyles = makeStyles((theme) => ({
  disclaimer: {
    fontSize: '14px',
    fontWeight: 400
  }
}))
