import React from 'react'
import { checkIban } from '../services/api'
import Container from '@material-ui/core/Container'
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'
import { useTranslation } from 'react-i18next'
import { ApiValidatedField } from './ApiValidatedField'
import { CadastralReferenceField } from './CadastralReferenceField'

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
