import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { checkIban } from '../services/api'

import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
}))

function ApiValidatedField({
  name,
  id,
  label,
  variant,
  value = '',
  onChange,
  onBlur,
  error,
  inputFilter,
  remoteCheck,
  helperText,
  errorText,
  autoFocus = false,
  leadingIcon
}) {
  const classes = useStyles()

  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const { t } = useTranslation()

  const LeadingIcon = leadingIcon
  const hasError = currentValue && !isValid

  const handleChange = (event) => {
    let value = event.target.value
    setCurrentValue(inputFilter ? inputFilter(value) : value)
  }

  useEffect(() => {
    onChange({ value: currentValue, valid: false })
    if (currentValue.length <= 28) {
      setIsValid(false)
      return
    }
    setIsLoading(true)
    remoteCheck(currentValue)
      .then((response) => {
        onChange({ value: currentValue, valid: response?.state === true })
        setIsValid(response?.state === true)
        setIsLoading(false)
      })
      .catch((error) => {
        const errorStatus = error?.response?.data?.state
          ? error?.response?.data?.state
          : false
        setIsValid(errorStatus)
        setIsLoading(false)
        onChange({ value: currentValue, valid: errorStatus })
      })
  }, [currentValue])

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
        value={currentValue}
        onChange={handleChange}
        onBlur={onBlur}
        error={hasError}
        helperText={hasError ? errorText ?? t('INVALID_FORMAT') : helperText}
        InputProps={{
          startAdornment: LeadingIcon && (
            <InputAdornment className={classes.icon} position="start">
              <LeadingIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading && <CircularProgress size={24} />}
              {!isLoading && isValid && <CheckOutlinedIcon color="primary" />}
            </InputAdornment>
          )
        }}
      />
    </>
  )
}

function IBANField(props) {
  const { t } = useTranslation()
  const { onChange, ...others } = props
  function inputFilter(value) {
    if (!value) return value
    value = value.match(/[\s0-9A-Za-z]{0,29}/)[0] // TODO: Do not cut chars after not matching one
    value = value.toUpperCase()
    value = value.split(' ').join('')
    value = value.match(/.{1,4}/g).join(' ')
    return value

  }
  function remoteCheck(value) {
    return checkIban(value)
  }

  return (
    <ApiValidatedField
      {...others}
      leadingIcon={AccountBalanceOutlinedIcon}
      errorText={t('INVALID_IBAN_FORMAT')}
      inputFilter={inputFilter}
      remoteCheck={remoteCheck}
      onChange={(newValue) => {
        return onChange({
          ...newValue,
          IBAN: newValue.value,
          IBANValid: newValue.valid
        })
      }}
    />
  )
}
export function Test() {
  const [value, setValue] = React.useState()
  const [valid, setValid] = React.useState()
  const [value2, setValue2] = React.useState()
  const [valid2, setValid2] = React.useState()
  return (
    <>
      <Container>
        <IBANField
          value={value}
          onChange={(newValue) => {
            setValue(newValue.IBAN)
            setValid(newValue.IBANValid)
          }}
          error={(value || valid) && value !== undefined}
          helperText={
            (value !== undefined && (value || valid)) || 'Esto es un campo IBAN'
          }
        />
        <div>Value: {value}</div>
        <div>Valid: {'' + valid}</div>
        <IBANField
          value={value2}
          onChange={(newValue) => {
            setValue2(newValue.IBAN)
            setValid2(newValue.IBANValid)
          }}
          helperText={'Esto es un altre camp IBAN'}
        />
        <div>Value: {value2}</div>
        <div>Valid: {'' + valid2}</div>
      </Container>
    </>
  )
}

export default IBANField
