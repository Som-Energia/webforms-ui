import React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { textField } from '../gurbTheme'


const Select = (props) => {
    const { options, value, handleChange } = props

    return (
            <TextField
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
                value={value}>
                {options.map((element) => (
                    <MenuItem key={element.id} value={element.id}>
                        {element.value}
                    </MenuItem>
                ))}
            </TextField>
    )
}

export default Select
