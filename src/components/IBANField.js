import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { checkCadastralReference, checkIban } from '../services/api'

import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import MapIcon from '@material-ui/icons/Map'
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
  const [currentValue, setCurrentValue] = useState(value)
  const { t } = useTranslation()

  const LeadingIcon = leadingIcon
  const hasError = !!currentValue && !isValid

  const handleChange = (event) => {
    let value = event.target.value
    const formattedValue = inputFilter ? inputFilter(value) : value
    setCurrentValue(formattedValue)
  }

  useEffect(() => {
    onChange({ value: currentValue, valid: false })
    if (!localCheck(currentValue)) {
      setIsValid(false)
      return
    }
    setIsLoading(true)
    remoteCheck(currentValue).then((isOk) => {
      onChange({ value: currentValue, valid: isOk })
      setIsValid(isOk)
      setIsLoading(false)
      console.log({ name, hasError, isValid, currentValue })
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
        value={value}
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
    value = value.replace(/[^0-9A-Za-z]/g, '') // TODO: Do not cut chars after not matching one
    value = value.slice(0, 24)
    value = value.toUpperCase()
    value = value.split(' ').join('')
    value = value.match(/.{1,4}/g).join(' ')
    return value
  }
  function localCheck(value) {
    return value.replaceAll(' ', '').length === 24
  }
  function remoteCheck(value) {
    return checkIban(value)
      .then((response) => {
        return response?.state === true
      })
      .catch((error) => {
        return !!error?.response?.data?.state
      })
  }

  return (
    <ApiValidatedField
      {...others}
      leadingIcon={AccountBalanceOutlinedIcon}
      errorText={t('INVALID_IBAN_FORMAT')}
      inputFilter={inputFilter}
      localCheck={localCheck}
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


function CadastralReferenceField(props) {
  const { t } = useTranslation()
  const { onChange, ...others } = props
  function inputFilter(value) {
    if (!value) return value
    value = value.replace(/[^0-9A-Za-z]/g, '') // TODO: Do not cut chars after not matching one
    value = value.slice(0, 20)
    value = value.toUpperCase()
    value = [value.slice(0,7), value.slice(7,14), value.slice(14,18), value.slice(18,20)].join(' ')
    return value
  }
  function localCheck(value) {
    return value.replaceAll(' ', '').length === 20
  }
  function remoteCheck(value) {
    return checkCadastralReference(value)
      .then((response) => {
        return response?.state === true
      })
      .catch((error) => {
        return !!error?.response?.data?.state
      })
  }

  return (
    <ApiValidatedField
      {...others}
      leadingIcon={MapIcon}
      errorText={t('INVALID_CADASTRAL_REFERENCE_FORMAT')}
      inputFilter={inputFilter}
      localCheck={localCheck}
      remoteCheck={remoteCheck}
      onChange={onChange}
    />
  )
}



export function Test() {
  const [value, setValue] = React.useState()
  const [valid, setValid] = React.useState()
  const [value2, setValue2] = React.useState()
  const [valid2, setValid2] = React.useState()
  const [cadastralRef, setCadastralRef] = React.useState()
  const [cadastralRefValid, setCadastralRefValid] = React.useState()
  return (
    <>
      <Container>
        <IBANField
          name="old"
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
          name="new"
          value={value2}
          onChange={(newValue) => {
            setValue2(newValue.IBAN)
            setValid2(newValue.IBANValid)
          }}
          helperText={'Esto es un altre camp IBAN'}
        />
        <div>Value: {value2}</div>
        <div>Valid: {'' + valid2}</div>
        <CadastralReferenceField
          name="cadastralref"
          value={cadastralRef}
          onChange={(newValue) => {
            setCadastralRef(newValue.value)
            setCadastralRefValid(newValue.valid)
          }}
          helperText={'Referencia Cadastral'}
        />
        <div>Value: {cadastralRef}</div>
        <div>Valid: {'' + cadastralRefValid}</div>
      </Container>
    </>
  )
}

export default IBANField
