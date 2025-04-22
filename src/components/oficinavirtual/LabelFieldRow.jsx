import React from 'react'
import Box from '@mui/material/Box'


const LabelFieldRow = ({ label = '', children, isHighlight }) => {
  return (
    <Box sx={{ width: '100%', display: 'flex' }}>
      <Box sx={isHighlight ? customStyles.highlight : customStyles.label}>
        {label}
      </Box>
      <Box sx={{
        background: '#fff',
        fontSize: '14px',
        padding: '1em',
        color: 'text.primary',
        margin: '0 0 .5em 0',
        flex: '0 0 75%',
        maxWidth: '75%',
        '& p': {
          margin: 0
        }
      }}>
        {children}
      </Box>
    </Box>
  )
}

export default LabelFieldRow

const customStyles = {
  label: {
    background: '#D9D9D9',
    // borderRight: '5px #eee solid',
    fontSize: '14px',
    padding: '1em',
    margin: '0 0 .5em 0',
    flex: '0 0 25%',
    maxWidth: '25%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary'
  },
  highlight: {
    background: '#D9D9D9',
    // borderRight: '5px #eee solid',
    fontSize: '14px',
    padding: '1em',
    margin: '0 0 .5em 0',
    flex: '0 0 25%',
    maxWidth: '25%',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    color: 'primary.main'
  },
}
