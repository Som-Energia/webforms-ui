import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const InputTitle = ({ text, description, required, isHeader }) => {
  return (
    <>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 1
      }}>
      <Typography variant={isHeader ? "headline4.regular" : "input.label"} color="primary.main">
        {text}
      </Typography>
      {required && (
        <Typography variant="body.sm.bold" color="error">
          {'*'}
        </Typography>
      )}
    </Box>
    <Box>
        {description && (
        <Typography variant="body.sm.regular" color="secondary.dark">
          {description}
        </Typography>
      )}
    </Box>
    </>
  )
}

export default InputTitle
