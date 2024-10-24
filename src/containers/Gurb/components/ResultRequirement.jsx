import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { textHeader4, textBody1 } from '../gurbTheme'

const ResultRequirement = ({
  containerColors,
  icon,
  textHeader,
  textBody,
  textHelper = false
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          borderRadius: '8px',
          ...containerColors
        }}>
        {icon}
        <Typography sx={{ ...textHeader4, marginTop: '1rem' }}>
          {textHeader}
        </Typography>
        <Typography sx={textBody1}>{textBody}</Typography>
      </Box>
      {textHelper && (
        <Typography
          sx={{
            marginTop: '1rem',
            fontSize: '14px',
            color: '#000000'
          }}>
          {textHelper}
        </Typography>
      )}
    </Box>
  )
}

export default ResultRequirement
