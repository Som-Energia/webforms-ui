import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const SelectField = (props) => {
  const {
    label,
    fieldName,
    value,
    options,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setErrors
  } = props

  const [field, setField] = useState(value)

  const handleChange = (event) => {
    setField(event.target.value)
  }

  useEffect(() => {
    setFieldValue(fieldName, field)
  }, [field])

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Select
          fullWidth
          id={`${fieldName}`}
          value={field}
          sx={{
            borderRadius: '8px'
          }}
          inputProps={{
            'aria-label': 'Without label'
          }}
          onChange={handleChange}>
          <MenuItem sx={{ display: 'none' }} label="None" value="" />
          {Object.keys(options).map((id) => (
            <MenuItem key={id} value={id}>
              {options[id]}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  )
}
export default SelectField
