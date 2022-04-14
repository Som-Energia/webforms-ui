import React, { useState, useEffect } from 'react'

import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import { checkCnae } from '../services/api'

const CnaeField = (props) => {
  const {
    name,
    id,
    label,
    variant,
    value = '',
    onChange,
    onBlur,
    error,
    helperText,
    disabled = false,
    autoFocus = false
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [isValidCnae, setIsValidCnae] = useState(false)
  const [valueCnae, setValueCnae] = useState(value)
  const [cnaeDescription, setCnaeDescription] = useState(false)

  useEffect(() => {
    setIsValidCnae(false)
    setCnaeDescription(false)
    onChange({ cnae: valueCnae, valid: false })

    if (valueCnae.length > 3) {
      setIsLoading(true)
      checkCnae(valueCnae)
        .then((response) => {
          const validCnae = response?.state === true
          setIsValidCnae(validCnae)
          setCnaeDescription(response?.data?.description)
          setIsLoading(false)
          onChange({ cnae: valueCnae, valid: validCnae })
        })
        .catch((error) => {
          console.error(error.response)
          const errorStatus = error?.response?.data?.data?.valid
            ? error?.response?.data?.data?.valid
            : false
          setIsValidCnae(errorStatus)
          setCnaeDescription(false)
          setIsLoading(false)
          onChange({ cnae: valueCnae, valid: isValidCnae })
        })
    }
  }, [valueCnae])

  const handleChange = (event) => {
    let value = event.target.value.match(/[0-9]{0,8}/)
    value = value[0]
    setValueCnae(value)
  }

  const handleBlur = (event) => {
    onBlur(event)
  }

  return (
    <>
      <TextField
        id={id}
        name={name}
        label={label}
        variant={variant}
        fullWidth
        required
        disabled={disabled}
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!isLoading && error}
        helperText={
          !isLoading && ((value !== '' && cnaeDescription) || helperText)
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isLoading && <CircularProgress size={24} />}
              {!isLoading && value !== '' && isValidCnae && (
                <CheckOutlinedIcon color="primary" />
              )}
            </InputAdornment>
          )
        }}
      />
    </>
  )
}

export default CnaeField
