import React from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'



const AlertBox = ({ severity, title, description, children, variant, icon }) => {
  const theme = useTheme ()

  const primary2Color = theme.palette.primary2.main
  const primary2Bg = '#ffebd2' //ligher background than the theme one
  
  const customSx =
  severity === 'warning'
    ? {
        backgroundColor: primary2Bg,
        border: 'none',
        color: primary2Color,
        '& .MuiAlertTitle-root': {
          color: primary2Color,
        },
        '& .MuiTypography-root': {
          color: primary2Color,
        },
        '& *': {
          color: `${primary2Color} !important`,
        },
      }
    : {}

  return (
    <Box mt={0.75} mb={1.5}>
      <Alert severity={severity} icon={false} sx={customSx}>
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
