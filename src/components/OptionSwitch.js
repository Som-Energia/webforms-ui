import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'

import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
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
  },
  title: {
    fontSize: '1.2rem',
    paddingBottom: '8px'
  },
  description: {
    fontSize: '1rem'
  }
}))

const OptionSwitch = (props) => {
  const classes = useStyles()
  const { title = '', description = '', initialValue = false } = props

  const [value, setValue] = useState(initialValue)

  return (
    <Paper elevation={0} className={classes.subsPaper}>
      <div className={classes.optionContainer}>
        <Typography variant="h5" className={classes.title}>
          {title}
        </Typography>
        <Typography variant="body1" className={classes.description}>
          {description}
        </Typography>
      </div>
      <div className={classes.switchContainer}>
        <Switch
          checked={value}
          onChange={(event) => setValue(event.target.checked)}
          color="primary"
          inputProps={{ 'aria-label': `subscription ${title} switcher` }}
        />
      </div>
    </Paper>
  )
}

export default OptionSwitch
