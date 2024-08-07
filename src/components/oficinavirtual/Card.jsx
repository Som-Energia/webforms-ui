import React from 'react'

import Box from '@mui/material/Box'

const Card = ({ variant = 'h1', children, className, sx }) => {

  return <Box sx={{
    ...sx,
    width: '100%',
    background: '#fff',
    color: 'pagetitle.main',
    fontSize: '14px',
    padding: '1.25rem 1.25rem',
    margin: '0 0 .5em 0',
    p: {
      lineHeight: '1.5'
    },
    '& p:first-of-type': {
      marginTop: 0
    },
    '& p:last-child': {
      marginBottom: 0
    },
    '& li': {
      marginBottom: '0.5rem',
      lineHeight: '1.5'
    }
  }} className={`${className || ''}`}>{children}</Box>
}

export default Card