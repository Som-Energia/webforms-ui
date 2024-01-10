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
  autoFocus = false,
  leadingIcon
}) {
  const classes = useStyles()

  const [isLoading, setIsLoading] = useState(false)
  const [formerValue, setFormerValue] = useState(undefined)
  const { t } = useTranslation()

  const LeadingIcon = leadingIcon

  function checkValue(value) {
    setFormerValue(value)
    const result = localCheck(value)
    const needsRemote = result.valid
    onChange({...result, valid: false})
    if (!needsRemote) return
    setIsLoading(true)
    remoteCheck(value).then((result) => {
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
        error={error}
        helperText={
          isLoading
            ? t('API_VALIDATED_FIELD_CHECKING')
            : helperText
        }
        InputProps={{
          startAdornment: LeadingIcon && (
            <InputAdornment className={classes.icon} position="start">
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
          ): null
        }}
      />
    </>
  )
}

export default ApiValidatedField
