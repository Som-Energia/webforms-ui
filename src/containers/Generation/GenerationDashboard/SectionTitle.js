import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

const useStyles = makeStyles({
  h2: {
    background: '#96b633',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '14px',
    margin: '10px 0 4px 0',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center'
  }
})

function SectionTitle({ text, children }) {
  const classes = useStyles()
  return (
    <Grid container className={classes.h2}>
      <Typography component="h2">
        {text}
      </Typography>
      {children}
    </Grid>
  )
}

export default SectionTitle
