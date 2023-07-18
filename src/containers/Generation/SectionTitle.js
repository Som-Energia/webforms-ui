import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
    h2: {
        background: '#96b633',
        color: '#fff',
        textTransform:'uppercase',
        fontSize: '14px',
        margin: '10px 0 4px 0',
        padding: '1em',
    },
  });

function SectionTitle({text}) {
    const classes = useStyles()
  return (
    <Typography component='h2' className={classes.h2}>{text}</Typography>
  )
}

export default SectionTitle