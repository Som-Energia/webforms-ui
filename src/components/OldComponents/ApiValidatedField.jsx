import React, { useState, useEffect } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

import { useTranslation } from 'react-i18next'

/*
TODO: known bugs

- Abort remote checks on edit.
If you edit the field while an external validation is in progress,
when the external validation ends it reverts the edit.
We should apply query abortion on every edit similar to the
ones proposed [here](https://dev.to/bil/using-abortcontroller-with-react-hooks-and-typescript-to-cancel-window-fetch-requests-1md4).

- Restore selection (cursor).
Editing in the middle moves the cursor to the end, making editing a pain.
When an edition in the middle changes the spaces position within the content,
React's automatic cursor restoration thinks it is a full programmatic
value replacement and moves the cursor at the end.
*/


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
  remoteCheck = false,
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
      return
    }
    const compactValue = result.value
    onChange({ value: compactValue, valid: false, error: t('API_VALIDATED_FIELD_CHECKING')  })
    setIsLoading(true)
    remoteCheck(compactValue).then((result) => {
      setIsLoading(false)
      onChange(result)
    })
  }

  const handleChange = (event) => {
    let inputValue = event.target.value
    const formattedValue = inputFilter ? inputFilter(inputValue) : inputValue
    checkValue(formattedValue)
  }

  const prettyValue = inputFilter? inputFilter(value) : value
  if (prettyValue !== formerValue) {
    checkValue(prettyValue)
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
        value={prettyValue}
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
              '& path': { color: 'primary.dark' }
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
