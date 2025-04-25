import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const InputTitle = ({ text, required }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 1
      }}>
      <Typography variant="input.label" color="primary.main">
        {text}
      </Typography>
      {required && (
        <Typography variant="body.sm.bold" color="error">
          {'*'}
        </Typography>
      )}
    </Box>
  )
}

export default InputTitle
