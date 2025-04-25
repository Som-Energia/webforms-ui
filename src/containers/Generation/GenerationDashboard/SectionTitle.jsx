import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'



function SectionTitle({ text, children }) {

  return (
    <Grid container sx={{
      backgroundColor: 'primary.light',
      color: '#fff',
      fontSize: '14px',
      margin: '10px 0 4px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px'
    }}>
      <Typography component="h2">
        {text}
      </Typography>
      {children}
    </Grid>
  )
}

export default SectionTitle
