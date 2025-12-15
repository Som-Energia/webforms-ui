import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
    setFieldValue,
    onChange,
    disabled = false
  } = props

  const { t } = useTranslation()

  const handleChange = (event) => {
    if (setFieldValue) {
      setFieldValue(fieldName, event.target.value)
    }
    else {
      onChange(event)
    }
  }

  const getSelectData = () => {
    if (Array.isArray(options)) {
      return (
        options.map((option) => {
          return (
          <MenuItem id={`${fieldName}-${option.id}`} key={option.id} value={option.id}>
            {t(option.name)}
          </MenuItem>
        )})
      )
    }
    else {
      return (
        Object.keys(options).map((id) => (
          <MenuItem id={`${fieldName}-${id}`} key={id} value={id}>
            {t(options[id])}
          </MenuItem>
        ))
      )
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
          {getSelectData()}
        </Select>
      </Grid>
    </Grid>
  )
}
export default SelectField
