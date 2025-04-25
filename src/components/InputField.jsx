import React from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

import InputTitle from './InputTitle'

export const HelperText = ({ helperText, iconHelper }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
      {iconHelper && (
        <InfoOutlinedIcon
          sx={{ color: 'secondary', fontSize: '14px', margin: '2px' }}
        />
      )}
      <Typography color="secondary" variant="body.xs.regular">
        {helperText}
      </Typography>
    </Box>
  )
}

const InputField = React.memo(
  ({
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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <InputTitle text={textFieldName} required={required} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body.sm.regular">
            {textFieldNameHelper}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
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
            onChange={handleChange}
            value={value}
            error={touched && error !== undefined}
          />
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item xs={12}>
              <HelperText
                helperText={textFieldHelper}
                iconHelper={iconHelper}
              />
            </Grid>
            {touched && error && (
              <Grid item xs={12} marginLeft={'4px'}>
                <Typography variant="error" color="error">
                  {t(error)}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    )
  }
)
export default InputField
