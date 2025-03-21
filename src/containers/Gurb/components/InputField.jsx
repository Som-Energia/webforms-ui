import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CircularProgress from '@mui/material/CircularProgress'

import { textHeader4, textHeader5, textHelper1 } from '../gurbTheme'
import InputTitle from './InputTitle'

import { textField } from '../gurbTheme'

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
  readonlyField = false,
  required = false,
  endAdornmentText = false,
  startAdornmentText = false,
  numInputs = false,
  name = false
}) => {
  const { t } = useTranslation()

  return (
    <Box>
      <InputTitle
        text={textFieldName}
        textStyle={textHeader4}
        required={required}
      />
      <Typography sx={textHeader5}>{textFieldNameHelper}</Typography>
      <TextField
        sx={textField}
        name={name}
        data-cy={name}
        disabled={readonlyField}
        fullWidth
        InputProps={{
          sx: { borderRadius: '8px' },
          onBlur: handleBlur,
          startAdornment: startAdornmentText && numInputs > 1 && (
            <InputAdornment position="start">
              {startAdornmentText}
            </InputAdornment>
          ),
          endAdornment:
            (isLoading && (
              <InputAdornment position="end">
                {<CircularProgress size={24} />}
              </InputAdornment>
            )) ||
            endAdornmentText
        }}
        label={value ? undefined : textFieldLabel}
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
