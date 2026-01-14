import { useContext } from 'react'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import GurbErrorContext from '../../../../context/GurbErrorContext'
import { link } from '../../../../themes/gurbTheme'
import { textHeader4, textBody1 } from '../../../../themes/gurbTheme'

const AlertRequirement = ({
  severity = 'alert',
  textHeader,
  textBody,
  textHelper,
  textHelperAction
}) => {
  const { setError, setErrorInfo } = useContext(GurbErrorContext)

  const colors = {
    alert: '#ED961D',
    error: '#EE4949',
    success: '#96B633'
  }
  const iconStyle = { fontSize: '50px' }
  const icons = {
    alert: (
      <ReportProblemRoundedIcon sx={{ ...iconStyle, color: colors.alert }} />
    ),
    error: <CancelOutlinedIcon sx={{ ...iconStyle, color: colors.error }} />,
    success: <CheckCircleIcon sx={{ ...iconStyle, color: colors.success }} />
  }
  const containerStyles = {
    border: `1px solid ${colors[severity] || colors.alert}`,
    backgroundColor: '#FFF4E5',
    padding: '2rem',
    paddingBottom: '3rem',
    borderRadius: '8px'
  }
  const icon = icons[severity] || icons.alert

  return (
    <Grid data-testId={`alert-${severity}`} container spacing={2} align={'center'}>
      <Grid item xs={12}>
        <Grid align={'center'} container rowSpacing={1} sx={containerStyles}>
          <Grid item xs={12}>
            {icon}
          </Grid>
          <Grid item xs={12}>
            <Typography sx={textHeader4}>{textHeader}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={textBody1}>{textBody}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {textHelper && (
          <Typography
            sx={{
              fontSize: '14px',
              color: '#000000'
            }}>
            <Link
              component="button"
              color="inherit"
              sx={link}
              onClick={() => {
                setError(false)
                setErrorInfo({})
                textHelperAction()
              }}>
              {textHelper}
            </Link>
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default AlertRequirement
