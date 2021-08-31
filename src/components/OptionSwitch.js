import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'

import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  subsPaper: {
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '4px solid gray',
    borderColor: theme.palette.secondary.main
  },
  active: {
    borderColor: theme.palette.primary.main
  },
  optionContainer: {
    paddingRight: '32px'
  },
  switchContainer: {
    paddingLeft: '32px'
  },
  title: {
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 700,
    paddingBottom: '8px'
  },
  description: {
    fontSize: '1rem'
  }
}))

const OptionSwitch = (props) => {
  const classes = useStyles()
  const { title = '', description = '', value = false } = props

  const [state, setState] = useState(value)

  return (
    <Paper
      elevation={0}
      className={clsx(classes.subsPaper, state && classes.active)}>
      <div className={classes.optionContainer}>
        <Typography
          variant="h5"
          className={classes.title}
          onClick={() => setState(!state)}>
          {title}
        </Typography>
        <Typography variant="body1" className={classes.description}>
          {description}
        </Typography>
      </div>
      <div className={classes.switchContainer}>
        <Switch
          checked={state}
          onChange={(event) => setState(event.target.checked)}
          color="primary"
          inputProps={{ 'aria-label': `subscription ${title} switcher` }}
        />
      </div>
    </Paper>
  )
}

export default OptionSwitch
