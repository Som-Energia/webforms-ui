import React from 'react'
import Box from '@mui/material/Box'

import loading from '../images/loading.svg'

const Loading = () => {
  return (
    <Box data-testid={'loading-component'} sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }} >
      <img alt="Loading..." src={loading} />
    </Box>
  )
}

export default Loading
