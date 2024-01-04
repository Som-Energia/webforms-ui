import React from 'react'
import Container from '@material-ui/core/Container'
import CadastralReferenceField from './CadastralReferenceField'
import IBANField from './IBANField'

function ExampleWrap({ component, ...props }) {
  const [value, setValue] = React.useState()
  const [valid, setValid] = React.useState()
  const Component = component
  return (
    <>
      <Component
        {...props}
        value={value}
        onChange={(newValue) => {
          setValue(newValue.value)
          setValid(newValue.valid)
        }}
        errorText={'Formato invalido'}
        helperText={'Text d\'ajuda'}
      />
      <div>Value: {value}</div>
      <div>Valid: {'' + valid}</div>
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
