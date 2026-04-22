import React, { useState, useEffect } from 'react'

import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'

import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear';

import { checkVat } from '../../services/api'
import { checkPhisicalVAT } from '../../services/utils'

const VATField = (props) => {
  const {
    name,
    id,
    label,
    variant,
    value,
    onChange,
    isVatTouched,
    error,
    helperText,
    setFieldTouched,
    autoFocus = false
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [isValidVAT, setIsValidVAT] = useState(false)
  const [isPhisicalVAT, setIsPhisicalVAT] = useState(false)
  const [valueVAT, setValueVAT] = useState(value)

  useEffect(() => {
    setIsValidVAT(false)
    onChange({ vat: valueVAT, isPhisical: isPhisicalVAT, valid: false })
    if (valueVAT.length > 8) {
      setIsLoading(true)
      checkVat(valueVAT)
        .then((response) => {
          const validVat = response?.data?.valid === true
          setIsValidVAT(validVat)
          const phisicalVAT = checkPhisicalVAT(valueVAT)
          setIsPhisicalVAT(phisicalVAT)
          setIsLoading(false)
          onChange({
            vat: valueVAT,
            isPhisical: phisicalVAT,
            isMember: response?.data?.is_member,
            valid: validVat,
            exists: response?.data?.exists
          })
        })
        .catch((error) => {
          const errorStatus = error?.response?.data?.data?.valid
            ? error?.response?.data?.data?.valid
            : false
          setIsValidVAT(errorStatus)
          setIsLoading(false)
          onChange({
            vat: valueVAT,
            isPhisical: isPhisicalVAT,
            valid: isValidVAT
          })
        })
    }
  }, [valueVAT])

  const handleChange = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    value = value[0].toUpperCase()
    if (!isVatTouched) {
      setFieldTouched(name, true)
    }
    setValueVAT(value)
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
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        error={error || (!isLoading && !isValidVAT && isVatTouched)}
        helperText={!isLoading && helperText}
        InputProps={{
          endAdornment: isVatTouched && (
            <InputAdornment position="end">
              {
                isLoading
                  ? <CircularProgress size={24} />
                  : !isValidVAT || error ? <ClearIcon color={'error'} /> : <CheckIcon color={'primary'} />
              }
            </InputAdornment>
          )
        }}
      />
    </>
  )
}

export default VATField
