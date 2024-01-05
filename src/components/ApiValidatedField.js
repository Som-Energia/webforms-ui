import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
}))

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
  errorText,
  autoFocus = false,
  leadingIcon
}) {
  const classes = useStyles()

  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [formerValue, setFormerValue] = useState(undefined)
  const { t } = useTranslation()

  const LeadingIcon = leadingIcon
  const hasError = !!value && !isValid

  function checkValue(value) {
    setFormerValue(value)
    onChange({ value, valid: false })
    setIsValid(false)
    if (!localCheck(value)) {
      return
    }
    setIsLoading(true)
    remoteCheck(value).then((result) => {
      setIsValid(result.valid)
      setIsLoading(false)
      onChange(result)
    })
  }

  const handleChange = (event) => {
    let value = event.target.value
    const formattedValue = inputFilter ? inputFilter(value) : value
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
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        error={error ?? hasError}
        helperText={hasError ? errorText ?? t('INVALID_FORMAT') : helperText}
        InputProps={{
          startAdornment: LeadingIcon && (
            <InputAdornment className={classes.icon} position="start">
              <LeadingIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading ? (
                <CircularProgress size={24} />
              ) : isValid ? (
                <CheckOutlinedIcon color="primary" />
              ) : null}
            </InputAdornment>
          )
        }}
      />
    </>
  )
}

export default ApiValidatedField
