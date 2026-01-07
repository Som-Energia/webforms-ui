import React from 'react'
import Container from '@mui/material/Container'
import CadastralReferenceField from './CadastralReferenceField'
import IBANField from './IBANField'
import CAUField from './CAUField'

function ExampleWrap({ component, ...props }) {
  const [value, setValue] = React.useState()
  const [valid, setValid] = React.useState()
  const [extra, setExtra] = React.useState()
  const Component = component
  return (
    <>
      <Component
        {...props}
        value={value}
        error={value && !valid}
        onChange={(newValue) => {
          const {value, valid, ...extra} = newValue
          setValue(value)
          setValid(valid)
          setExtra(extra)
        }}
        helperText={(!value || valid)?'Text d\'ajuda':extra?.error??'Formato invalido'}
      />
      <div>Value: {value}</div>
      <div>Valid: {'' + valid}</div>
      <div>Extra: {JSON.stringify(extra)}</div>
    </>
  )
}

export function Example() {
  const [value, setValue] = React.useState()
  const [valid, setValid] = React.useState()
  return (
    <>
      <Container>
        <ExampleWrap label={"Compte"} variant='outlined' component={IBANField} />
        <ExampleWrap label={"Cadastre"} variant='outlined' component={CadastralReferenceField} />
        <ExampleWrap label={"CAU"} variant='outlined' component={CAUField} />
        {/* Legacy deprecated interface */}
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
      </Container>
    </>
  )
}
