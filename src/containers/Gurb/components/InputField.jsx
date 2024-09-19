import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { textHeader4, textHelper1 } from '../gurbTheme'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
// import InputBase from '@mui/material/InputBase';

export const HelperText = ({ helperText, iconHelper }) => {
  return (
    <Box sx={textHelper1}>
      {iconHelper && (
        <InfoOutlinedIcon sx={{ fontSize: '14px', margin: '2px' }} />
      )}
      {helperText}
    </Box>
  )
}

const InputField = ({
  textFieldName,
  textFieldHelper,
  iconHelper = false,
  handleChange,
  handleBlur,
  touched,
  value,
  error
}) => {
  return (
    <Box>
      <Typography sx={textHeader4}>{textFieldName}</Typography>
      <TextField
        sx={{
          '& .MuiFormHelperText-root': { color: '#B3B3B3' },
          '& .MuiInputLabel-root': { color: '#B3B3B3' },
          marginTop: '0.5rem'
        }}
        fullWidth
        InputProps={{
          sx: { borderRadius: '8px', display: 'flex' },
          onBlur: handleBlur
        }}
        label={textFieldName}
        helperText={
          touched && error ? (
            error
          ) : (
            <HelperText helperText={textFieldHelper} iconHelper={iconHelper} />
          )
        }
        onChange={handleChange}
        value={value}
        error={touched && error}
      />
    </Box>
  )
}
export default InputField
