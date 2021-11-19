import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const Header = ({ variant = 'h1', children }) => {
  const classes = useStyles()
  return <h3 className={classes.header}>{children}</h3>
}

export default Header

const useStyles = makeStyles((theme) => ({
  header: {
    width: '100%',
    background: '#fff',
    color: '#96b633',
    padding: '1rem 1.5rem',
    margin: '0 0 .5em 0',
    fontSize: '18px'
  }
}))
