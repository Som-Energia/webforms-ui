import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import WarningIcon from '@mui/icons-material/WarningAmberOutlined'

import { alertBoxStyles } from './alertBoxStyles'


const AlertBox = ({
  severity,
  title,
  description,
  children,
  variant,
  icon,
  textAlign = 'center',
}) => {

  const renderCustomIcon = () => {
    switch (icon) {
      case 'warning':
        return <WarningIcon color={severity} />
      case 'error':
        return <ErrorIcon color={severity} />
      case 'success':
        return <CheckCircleIcon color={severity} />
      case 'info':
      default:
        return <InfoIcon color={severity} />
    }
  }

  return (
    <Box
      data-testid={`alert-${severity}`}
      sx={{ mt: '0', mb: '30px !important' }}>
      <Alert
        severity={severity}
        icon={icon ? renderCustomIcon() : false}
        sx={{
          ...alertBoxStyles,
          textAlign: textAlign,
        }} >
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
    </Box >
  )
}
export default AlertBox
