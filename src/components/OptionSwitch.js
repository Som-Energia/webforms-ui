import React, { useState } from 'react'

import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'

const customStyles = {
  subsPaper: {
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '4px solid gray',
    borderColor:'secondary.main'
  },
  active: {
    borderColor: 'primary.main'
  },
  optionContainer: {
    paddingRight: '32px'
  },
  switchContainer: {
    paddingLeft: '32px'
  },
  title: {
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 700,
    paddingBottom: '8px'
  },
  description: {
    fontSize: '1rem'
  }
}

const OptionSwitch = (props) => {
  const { title = '', description = '', value = false } = props
  const [state, setState] = useState(value)

  return (
    <Paper
      elevation={0}
      sx={[customStyles.subsPaper, state && customStyles.active]}>
      <Box sx={customStyles.optionContainer}>
        <Typography
          variant="h5"
          sx={customStyles.title}
          onClick={() => setState(!state)}>
          {title}
        </Typography>
        <Typography variant="body1" sx={customStyles.description}>
          {description}
        </Typography>
      </Box>
      <Box sx={customStyles.switchContainer}>
        <Switch
          checked={state}
          onChange={(event) => setState(event.target.checked)}
          color="primary"
          inputProps={{ 'aria-label': `subscription ${title} switcher` }}
        />
      </Box>
    </Paper>
  )
}

export default OptionSwitch
