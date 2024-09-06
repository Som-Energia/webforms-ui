import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { textHeader4 } from '../gurbTheme'

const InputField = ({ TextFieldName, TextFieldHelper }) => {
  return (
    <Box>
      <Typography sx={ textHeader4 }>TextFieldName</Typography>
      <TextField
        sx={{
          '& .MuiFormHelperText-root': { color: '#B3B3B3' },
          '& .MuiInputLabel-root': { color: '#B3B3B3' },
          marginTop: '0.5rem'
        }}
        fullWidth
        InputProps={{
          sx: { borderRadius: '8px', display: 'flex' }
        }}
        label={TextFieldName}
        helperText={TextFieldHelper}
      />
    </Box>
  )
}
export default InputField
