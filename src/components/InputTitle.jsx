import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const InputTitle = ({ text, required }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row'
      }}>
      <Typography variant="body.sm.bold">{text}</Typography>
      {required && (
        <Typography variant="body.sm.bold" sx={{ color: 'red' }}>
          *
        </Typography>
      )}
    </Box>
  )
}

export default InputTitle
