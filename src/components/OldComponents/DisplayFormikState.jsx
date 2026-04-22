import React from 'react'

import Paper from '@mui/material/Paper'

const DisplayFormikState = props => (
  <Paper elevation={3} style={{ margin: '1rem 0' }}>
    <pre
      style={{
        background: '#fff',
        fontSize: '1rem',
        padding: '1.5rem'
      }}
    >
      <strong>props</strong> ={' '}
      {JSON.stringify(props, null, 2)}
    </pre>
  </Paper>
)

export default DisplayFormikState
