import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import WarningIcon from '@mui/icons-material/WarningAmberOutlined'


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
          backgroundColor: 'background.alertBox',
          color: 'primary2.main',
          '& .MuiAlertTitle-root': {
            color: 'primary2.main'
          },
          '& .MuiTypography-root': {
            color: 'primary2.main',
            fontSize: 'body.md.regular'
          },
          '& a': theme => ({
            color: `${theme.palette.primary2.main} !important`
          }),
          textAlign: textAlign,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          '& .MuiAlert-icon': {
            display: 'flex',
            alignItems: 'flex-start',
            mt: '0.35em'
          }
        }
        } >
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
