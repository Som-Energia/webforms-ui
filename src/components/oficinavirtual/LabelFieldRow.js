import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const LabelFieldRow = ({ label = '', children }) => {
  const classes = useStyles()
  return (
    <div className={classes.row}>
      <div className={classes.label}>{label}</div>
      <div className={classes.field}>{children}</div>
    </div>
  )
}

export default LabelFieldRow

const useStyles = makeStyles((theme) => ({
  row: {
    width: '100%',
    display: 'flex'
  },
  label: {
    background: '#cccc',
    borderRight: '5px #f2f2f2 solid',
    fontSize: '14px',
    padding: '1em',
    margin: '0 0 .5em 0',
    flex: '0 0 25%',
    maxWidth: '25%',
    display: 'flex',
    alignItems: 'center'
  },
  field: {
    background: '#fff',
    fontSize: '14px',
    padding: '1em',
    margin: '0 0 .5em 0',
    flex: '0 0 75%',
    maxWidth: '75%',
    '& p': {
      margin: 0
    }
  }
}))
