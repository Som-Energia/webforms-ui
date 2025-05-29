import React from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import { getAlertBoxStyles } from '../themes/commonStyles'

const AlertBox = ({ severity, title, description, children, variant, icon }) => {
  const theme = useTheme()

  const customSx = getAlertBoxStyles(theme, severity)

  return (
    <Box mt={0.75} mb={1.5}>
      <Alert severity={severity} icon={false} sx={customSx}>
        <AlertTitle>{title}</AlertTitle>
        {description && (
          <Typography
            variant={variant || 'body1'}
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        )}
        {children}
      </Alert>
    </Box>
  )
}
export default AlertBox
