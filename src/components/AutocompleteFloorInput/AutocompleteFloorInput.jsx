import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import './AutocompleteFloorInput.css'

export default function SomAutocompleteFloorInput({
  fieldName,
  value = '',
  options = [],
  onChangeHandler = () => {}
}) {
  const autocompleteOptions = options.map((item) => item.translation)
  const defaultOptionValue =
    options.find(({ code }) => code === value)?.translation || value || ''
  const [optionValue, setOptionValue] = useState(defaultOptionValue)

  const handleAutocompleteBlur = (event) => {
    const { value } = event.target

    const finalValue = options.some((item) => item.translation === value)
      ? value
      : value.replace(/[^0-9-]/g, '')

    setOptionValue(finalValue)
    fireChangeHandlerWithCode(finalValue)
  }

  const fireChangeHandlerWithCode = (value) => {
    const finalCodeValue =
      options.find(({ translation }) => translation === value)?.code || value

    onChangeHandler({ target: { name: fieldName, value: finalCodeValue } })
  }

  return (
    <>
      <Autocomplete
        className={'somAutocompleteInput'}
        freeSolo
        disableClearable
        clearOnBlur
        onBlur={handleAutocompleteBlur}
        value={optionValue}
        options={autocompleteOptions}
        renderInput={(params) => <TextField {...params} />}
      />
      <input type="hidden" value={value} name={fieldName}></input>
    </>
  )
}
