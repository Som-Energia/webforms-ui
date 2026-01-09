import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import InputTitle from '../InputTitle'

import './AutocompleteFloorInput.css'

export default function SomAutocompleteFloorInput({
  fieldName,
  title,
  helper,
  value = '',
  options = [],
  onChangeHandler = () => {}
}) {
  if (!fieldName) {
    console.error('[fieldName] property is required')
  }
  if (!options?.length) {
    console.error('[options] property is rquired')
  }

  const autocompleteOptions = options.map((item) => item.translation)
  const defaultOptionValue = options.find(({ code }) => code === value) || value
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
      <Grid container spacing={1}>
        {title && (
          <Grid item xs={helper ? 6 : 12} sx={{ mb: '6px' }}>
            <InputTitle text={title}></InputTitle>
          </Grid>
        )}
        {title && helper && (
          <Grid item xs={6}>
            <Typography variant="body.sm.regular" color="secondary.extraDark">
              {helper}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Autocomplete
            className={'somAutocompleteInput'}
            freeSolo
            disableClearable
            clearOnBlur
            onBlur={handleAutocompleteBlur}
            value={optionValue}
            options={autocompleteOptions}
            renderInput={(params) => <TextField {...params} name={fieldName} />}
          />
          <input type="hidden" value={value} name={fieldName}></input>
        </Grid>
      </Grid>
    </>
  )
}
