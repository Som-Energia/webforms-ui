import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import WarningIcon from '@mui/icons-material/WarningAmberOutlined'

import { getAlertBoxStyles } from '../../themes/commonStyles'

const AlertBox = ({
  severity,
  title,
  description,
  children,
  variant,
  icon,
  iconCustom = false,
  iconCustomSeverity = '',
  customTypographyStyle = {},
  customIconStyle = {}
}) => {
  const theme = useTheme()

  const customSx = getAlertBoxStyles(theme, severity)

  const renderCustomIcon = () => {
    const chosenSeverity = iconCustomSeverity || severity

    switch (chosenSeverity) {
      case 'warning':
        return <WarningIcon color="warning" />
      case 'error':
        return <ErrorIcon color="error" />
      case 'success':
        return <CheckCircleIcon color="success" />
      case 'info':
      default:
        return <InfoIcon color="info" />
    }
  }

  return (
    <Box
      data-testid={`alert-${severity}`}
      sx={{ mt: '0', mb: '30px !important' }}>
      <Alert
        severity={severity}
        icon={iconCustom ? renderCustomIcon() : icon ?? false}
        sx={{
          ...customSx,
          ...customIconStyle
        }}>
        <AlertTitle>{title}</AlertTitle>
        {description && (
          <Typography
            variant={variant || 'body1'}
            sx={customTypographyStyle}
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
