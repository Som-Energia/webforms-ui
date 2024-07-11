import React from 'react'
import { Grid, Typography } from '@mui/material'



function SectionTitle({ text, children }) {

  return (
    <Grid container sx={{
      background: '#96b633',
      color: '#fff',
      textTransform: 'uppercase',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Typography component="h2">
        {text}
      </Typography>
      {children}
    </Grid>
  )
}

export default SectionTitle
