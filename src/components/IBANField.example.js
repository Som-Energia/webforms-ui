import React from 'react';
import Container from '@material-ui/core/Container';
import { CadastralReferenceField } from './CadastralReferenceField';
import { IBANField } from './IBANField';


export function Example() {
  const [value, setValue] = React.useState();
  const [valid, setValid] = React.useState();
  const [value2, setValue2] = React.useState();
  const [valid2, setValid2] = React.useState();
  const [cadastralRef, setCadastralRef] = React.useState();
  const [cadastralRefValid, setCadastralRefValid] = React.useState();
  return (
    <>
      <Container>
        <IBANField
          name="old"
          value={value}
          onChange={(newValue) => {
            setValue(newValue.IBAN);
            setValid(newValue.IBANValid);
          }}
          error={(value || valid) && value !== undefined}
          helperText={(value !== undefined && (value || valid)) || 'Esto es un campo IBAN'} />
        <div>Value: {value}</div>
        <div>Valid: {'' + valid}</div>
        <IBANField
          name="new"
          value={value2}
          onChange={(newValue) => {
            setValue2(newValue.IBAN);
            setValid2(newValue.IBANValid);
          }}
          helperText={'Esto es un altre camp IBAN'} />
        <div>Value: {value2}</div>
        <div>Valid: {'' + valid2}</div>
        <CadastralReferenceField
          name="cadastralref"
          value={cadastralRef}
          onChange={(newValue) => {
            setCadastralRef(newValue.value);
            setCadastralRefValid(newValue.valid);
          }}
          helperText={'Referencia Cadastral'} />
        <div>Value: {cadastralRef}</div>
        <div>Valid: {'' + cadastralRefValid}</div>
      </Container>
    </>
  );
}
