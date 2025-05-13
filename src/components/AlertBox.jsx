import React from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const AlertBox = ({ severity, title, description, children, variant, icon }) => {
  return (
    <Box mt={0.75} mb={1.5}>
      <Alert severity={severity} icon={false}>
        <AlertTitle>{title}</AlertTitle>
        {description && (
          <Typography
            variant={variant || 'body1'}
            dangerouslySetInnerHTML={{
              __html: description
            }}
          />
        )}
        {children}
      </Alert>
    </Box>
  )
}
export default AlertBox
