import React from 'react'



const DisplayFormikState = props => (
  <div style={{ margin: '1rem 0' }}>
    <h3 style={{ fontFamily: 'monospace' }} />
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
  </div>
)

export default DisplayFormikState
