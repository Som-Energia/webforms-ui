import React, { useState, useEffect } from 'react'

import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import { checkVat } from '../services/api'
import { checkPhisicalVAT } from '../services/utils'

const VATField = (props) => {
  const { name, id, label, variant, value = '', onChange, onBlur, error, helperText, autoFocus = false } = props

  const [isLoading, setIsLoading] = useState(false)
  const [isValidVAT, setIsValidVAT] = useState(false)
  const [isPhisicalVAT, setIsPhisicalVAT] = useState(false)
  const [valueVAT, setValueVAT] = useState(value)

  useEffect(() => {
    if (valueVAT.length > 8) {
      setIsLoading(true)
      checkVat(valueVAT)
        .then(response => {
          const validVat = response?.data?.valid === true
          setIsValidVAT(validVat)
          const phisicalVAT = checkPhisicalVAT(valueVAT)
          setIsPhisicalVAT(phisicalVAT)
          setIsLoading(false)
          onChange({ vat: valueVAT, isPhisical: phisicalVAT, valid: validVat })
        })
        .catch(error => {
          console.log(error.response)
          const errorStatus = error?.response?.data?.data?.valid ? error?.response?.data?.data?.valid : false
          setIsValidVAT(errorStatus)
          setIsLoading(false)
          onChange({ vat: valueVAT, isPhisical: isPhisicalVAT, valid: isValidVAT })
        })
    } else {
      setIsValidVAT(false)
      onChange({ vat: valueVAT, isPhisical: isPhisicalVAT, valid: false })
    }
  }, [valueVAT])

  const handleChange = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,9}/)
    value = value[0].toUpperCase()
    setValueVAT(value)
  }

  const handleBlur = (event) => {
    // onChange({ vat: valueVAT, isPhisical: isPhisicalVAT, valid: isValidVAT })
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
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              { isLoading &&
                <CircularProgress size={24} />
              }
              { !isLoading && isValidVAT &&
                <CheckOutlinedIcon color="primary" />
              }
            </InputAdornment>
        }}
      />
    </>
  )
}

export default VATField
