import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const Card = ({ variant = 'h1', children, className }) => {
  const classes = useStyles()
  return <div className={`${classes.card} ${className}`}>{children}</div>
}

export default Card

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    background: '#fff',
    color: '#4d4d4d',
    fontSize: '14px',
    padding: '1.5rem 1.5rem',
    margin: '0 0 .5em 0',
    '& p:first-child': {
      marginTop: 0
    },
    '& p:last-child': {
      marginBottom: 0
    }
  }
}))
