import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

import { alertParticipation, alertParticipationTypography } from '../gurbTheme'

const AlertParticipation = ({ severity = 'info', informationText }) => {
  return (
    <Alert severity={severity} sx={alertParticipation}>
      <Typography
        sx={alertParticipationTypography}
        dangerouslySetInnerHTML={{
          __html: informationText
        }}
      />
    </Alert>
  )
}

export default AlertParticipation
