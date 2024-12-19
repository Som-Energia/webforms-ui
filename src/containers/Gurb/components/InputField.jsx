import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CircularProgress from '@mui/material/CircularProgress'

import { textHeader4, textHeader5, textHelper1 } from '../gurbTheme'

export const HelperText = ({
  helperText,
  iconHelper,
  justifyContent = false
}) => {
  return (
    <Box display="flex" justifyContent={justifyContent} sx={textHelper1}>
      {iconHelper && (
        <InfoOutlinedIcon sx={{ fontSize: '14px', margin: '2px' }} />
      )}
      {helperText}
    </Box>
  )
}

const InputField = ({
  textFieldLabel,
  textFieldName,
  textFieldNameHelper,
  textFieldHelper,
  iconHelper = false,
  handleChange,
  handleBlur,
  touched,
  value,
  error,
  isLoading = false,
  readonlyField = false
}) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ marginTop: '2rem' }}>
      <Typography sx={textHeader4}>{textFieldName}</Typography>
      <Typography sx={textHeader5}>{textFieldNameHelper}</Typography>
      <TextField
        sx={{
          '& .MuiFormHelperText-root': { color: '#B3B3B3' },
          '& .MuiInputLabel-root': { color: '#B3B3B3' },
          marginTop: '0.5rem'
        }}
        disabled={readonlyField}
        fullWidth
        InputProps={{
          sx: { borderRadius: '8px', display: 'flex' },
          onBlur: handleBlur,
          endAdornment: (
            <InputAdornment position="end">
              {isLoading && <CircularProgress size={24} />}
            </InputAdornment>
          )
        }}
        label={textFieldLabel}
        helperText={
          touched && error ? (
            t(error)
          ) : (
            <HelperText helperText={textFieldHelper} iconHelper={iconHelper} />
          )
        }
        onChange={handleChange}
        value={value}
        error={touched && error !== undefined}
      />
    </Box>
  )
}
export default InputField
