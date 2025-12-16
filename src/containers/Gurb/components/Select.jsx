import React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { textField } from '../../../themes/gurbTheme'


const Select = (props) => {
  const { options, value, handleChange, helperText } = props
  return (
    <TextField
      data-cy="select_component"
      sx={textField}
      required
      select
      fullWidth
      InputProps={{
        sx: {
          borderRadius: '8px',
          display: 'flex'
        }
      }}
      onChange={(event) => handleChange(event.target.value)}
      value={value}
      helperText={helperText}
    >
      {options.map((element) => (
        <MenuItem data-cy={element.id} key={element.id} value={element.value}>
          {element.text}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default Select
