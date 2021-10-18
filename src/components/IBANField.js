import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { checkIban } from '../services/api'

import CircularProgress from '@material-ui/core/CircularProgress'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'

import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
}))

function IBANField(props) {
  const classes = useStyles()
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
    autoFocus = false
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [isValidIBAN, setIsValidIBAN] = useState(false)
  const [IBAN, setIBAN] = useState(value)

  const handleChangeIBAN = (event) => {
    let value = event.target.value
    if (value) {
      value = value.match(/[\s0-9A-Za-z]{0,29}/)
      value = value[0].toUpperCase()
      value = value.split(' ').join('')
      value = value.match(/.{1,4}/g).join(' ')
    }
    setIBAN(value)
  }

  useEffect(() => {
    onChange({ IBAN: IBAN, IBANValid: false })
    if (IBAN.length > 27) {
      setIsLoading(true)
      checkIban(IBAN)
        .then((response) => {
          onChange({ IBAN: IBAN, IBANValid: response?.state === true })
          setIsValidIBAN(response?.state === true)
          setIsLoading(false)
        })
        .catch((error) => {
          const errorStatus = error?.response?.data?.state
            ? error?.response?.data?.state
            : false
          setIsValidIBAN(errorStatus)
          setIsLoading(false)
          onChange({ IBAN: IBAN, IBANValid: errorStatus })
        })
    } else {
      onChange({ IBAN: IBAN, IBANValid: false })
      setIsValidIBAN(false)
    }
  }, [IBAN])

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
        onChange={handleChangeIBAN}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        InputProps={{
          startAdornment: (
            <InputAdornment className={classes.icon} position="start">
              <AccountBalanceOutlinedIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading && <CircularProgress size={24} />}
              {!isLoading && isValidIBAN && (
                <CheckOutlinedIcon color="primary" />
              )}
            </InputAdornment>
          )
        }}
      />
    </>
  )
}

export default IBANField
