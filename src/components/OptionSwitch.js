import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'

import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  subsPaper: {
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionContainer: {
    paddingRight: '32px'
  },
  switchContainer: {
    paddingLeft: '32px'
  }
}))

const OptionSwitch = (props) => {
  const classes = useStyles()

  const { title = '', description = '' } = props

  return (
    <Paper elevation={0} className={classes.subsPaper}>
      <div className={classes.optionContainer}>
        <Typography variant="h5">{ title }</Typography>
        <Typography variant="body1">{ description }</Typography>
      </div>
      <div className={classes.switchContainer}>
        <Switch
          checked={true}
          onChange={() => false}
          color="primary"
          inputProps={{ 'aria-label': 'subscription switcher' }}
        />
      </div>
    </Paper>
  )
}

export default OptionSwitch
