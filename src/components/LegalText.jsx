import React from 'react'

import Typography from '@mui/material/Typography'

import TextLoader from './TextLoader'

// This component is a wrapper over TextLoader
// adding nice styles for legal text.

const LegalText = (props) => {
  return (
    <Typography
      sx={{
        '& a': {
          color: '#0B2E34'
        },
        '& h2': {
          fontSize: '1.25rem'
        },
        '& .pujar a': {
          fontSize: '1rem'
        },
        '& .sagnia': {
          pl: '1rem'
        }
      }}
      component='div'
    >
      <TextLoader {...props} />
    </Typography>
  )
}

export default LegalText
