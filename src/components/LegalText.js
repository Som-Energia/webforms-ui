import React from 'react'

import Typography from '@mui/material/Typography'

import TextLoader from './TextLoader'

// This component is a wrapper over TextLoader
// adding nice styles for legal text.

const LegalText = (props) => {
  return (
    <Typography
      component="body1"
      sx={{
        '& a': {
          color: 'secondary'
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
      }}>
      <TextLoader {...props} />
    </Typography>
  )
}

export default LegalText
