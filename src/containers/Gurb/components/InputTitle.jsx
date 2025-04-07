import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const InputTitle = ({ text, textStyle, required }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row'
      }}>
      <Typography variant="body.md.bold">{text}</Typography>
      {required && (
        <Typography variant="body.md.bold" sx={{color: 'red' }}>*</Typography>
      )}
    </Box>
  )
}

export default InputTitle
