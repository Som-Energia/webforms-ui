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
  leadingIcon,
  disabled
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formerValue, setFormerValue] = useState(undefined)
  const { t } = useTranslation()

  const LeadingIcon = leadingIcon

  function checkValue(valueToCheck) {
    setFormerValue(valueToCheck)
    if (valueToCheck == '') {
      onChange({ valueToCheck, valid: true, error: undefined })
      return
    }
    const result = localCheck(valueToCheck)
    const needsRemote = result.valid
    onChange({ ...result, valid: false })
    if (!needsRemote) return
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
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        error={error}
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
          endAdornment: isLoading || isLoading ? (
            <InputAdornment position="end">
              {isLoading ? (
                <CircularProgress size={24} />
              ) : error ? (
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
