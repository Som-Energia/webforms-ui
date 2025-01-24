import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const RequiredTitle = ({ text, textStyle, required }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row'
      }}>
      <Typography sx={textStyle}>{text}</Typography>
      {required && (
        <Typography sx={{ ...textStyle, color: 'red' }}>*</Typography>
      )}
    </Box>
  )
}

export default RequiredTitle
