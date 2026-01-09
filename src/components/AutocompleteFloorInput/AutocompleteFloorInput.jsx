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
  error,
  value = '',
  options = [],
  onChangeHandler = () => {},
  onBlurHandler = () => {}
}) {
  if (!fieldName) {
    console.error('[fieldName] property is required')
  }

  if (!options?.length) {
    console.error('[options] property is rquired')
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
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={value}
            error={error}
            options={options}
            defaultValue={''}
            isOgtionEqualToValue={(option, value) =>
              // Accepts numbers and an option from list
              Number.isInteger(Number(value)) || option === value
            }
            renderInput={(params) => <TextField {...params} name={fieldName} />}
          />
        </Grid>
      </Grid>
    </>
  )
}
