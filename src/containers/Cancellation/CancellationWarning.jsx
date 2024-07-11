import React from 'react'

import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

const CancellationWarning = () => {
  const { t } = useTranslation()

  return (
    <Box mt={0.75} mb={1.5}>
      <Alert severity="warning">
        <Typography
          sx={{
            fontSize: '120%',
            fontWeight: 400,
            fontVariant: 'small-caps',
          }}
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