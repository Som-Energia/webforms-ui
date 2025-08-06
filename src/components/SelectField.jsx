import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputTitle from './InputTitle'

const SelectField = (props) => {
  const {
    required = false,
    label,
    fieldName,
    value,
    options,
    values,
    errors,
    touched,
    setFieldValue,
    onChange,
    setFieldError,
    setFieldTouched,
    setErrors,
    disabled = false
  } = props

  const handleChange = (event) => {
    if(setFieldValue){
      setFieldValue(fieldName, event.target.value)
    }
    else{
      onChange(event)
    }
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12} sm={6}>
        <InputTitle text={label} required={required} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          '&.MuiGrid-item': {
            maxWidth: '100%'
          }
        }}>
        <Select
          disabled={disabled}
          fullWidth
          id={`${fieldName}`}
          value={value}
          sx={{
            borderRadius: '8px'
          }}
          inputProps={{
            'aria-label': 'Without label'
          }}
          onChange={handleChange}>
          <MenuItem sx={{ display: 'none' }} label="None" value="" />
          {Object.keys(options).map((id) => (
            <MenuItem id={`${fieldName}-${id}`} key={id} value={id}>
              {options[id]}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  )
}
export default SelectField
