import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextLoader from './TextLoader'

// This component is a wrapper over TextLoader
// adding nice styles for legal text.

const LegalText = (props) => {
  const classes = useStyles()
  return (
    <span className={classes.container}>
      <TextLoader {...props}/>
    </span>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    '& a': {
      color: theme.palette.text.secondary
    },
    '& h2': {
      fontSize: '1.25rem'
    },
    '& .pujar a': {
      fontSize: '1rem'
    },
    '& .sagnia': {
      paddingLeft: '1rem'
    }
  }
}))

export default LegalText
