import React, { useState, useEffect } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

import { useTranslation } from 'react-i18next'


export function ApiValidatedField({
  name,
  id,
  label,
  variant,
  value = '',
  onChange,
  onBlur,
  error,
  required,
  inputFilter,
  localCheck,
  remoteCheck,
  helperText,
  autoFocus = false,
  leadingIcon
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formerValue, setFormerValue] = useState(undefined)
  const { t } = useTranslation()

  const LeadingIcon = leadingIcon

  function checkValue(valueToCheck) {
    setFormerValue(valueToCheck)
    if (!valueToCheck) {
      onChange({ valueToCheck, valid: true, error: undefined })
      return
    }
    const result = localCheck(valueToCheck)
    if (!result.valid) {
      onChange(result)
      return
    }
    if (!remoteCheck) {
      onChange(result)
    }
    onChange({ ...result, valid: false, error: t('API_VALIDATED_FIELD_CHECKING')  })
    setIsLoading(true)
    remoteCheck(valueToCheck).then((result) => {
      setIsLoading(false)
      onChange(result)
    })
  }

  const handleChange = (event) => {
    let inputValue = event.target.value
    const formattedValue = inputFilter ? inputFilter(inputValue) : inputValue
    checkValue(formattedValue)
  }

  if (value !== formerValue) {
    checkValue(value)
  }

  return (
    <>
      <TextField
        id={id}
        name={name}
        label={label}
        variant={variant}
        fullWidth
        required={required}
        autoFocus={autoFocus}
        value={inputFilter?inputFilter(value):value}
        onChange={handleChange}
        onBlur={onBlur}
        error={!!error}
        helperText={
          isLoading
            ? t('API_VALIDATED_FIELD_CHECKING')
            : helperText
        }
        InputProps={{
          startAdornment: LeadingIcon && (
            <InputAdornment sx={{
              '& path': { color: 'rgba(0, 0, 0, 0.54)' }
            }} position="start">
              <LeadingIcon />
            </InputAdornment>
          ),
          endAdornment: isLoading || !error ? (
            <InputAdornment position="end">
              {isLoading ? (
                <CircularProgress size={24} />
              ) : value && !error ? (
                <CheckOutlinedIcon color="primary" />
              ) : null}
            </InputAdornment>
          ) : null
        }}
      />
    </>
  )
}

export default ApiValidatedField
