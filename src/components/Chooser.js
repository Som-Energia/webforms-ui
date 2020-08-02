import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import clsx from 'clsx'

import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    marginTop: theme.spacing(3)
  },
  title: {
    marginBottom: theme.spacing(3),
    color: '#96b633',
    textTransform: 'uppercase',
    fontWeight: 500
  },
  chooserItem: {
    display: 'block',
    cursor: 'pointer',
    minHeight: '100px',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    border: '2px solid rgba(0, 0, 0, 0.12)',
    '&:hover': {
      border: '2px solid rgba(0, 0, 0, 0.87)',
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }
  },
  chooserItemSelected: {
    border: '2px solid #96b633',
    backgroundColor: 'rgba(150, 182, 51, 0.08)',
    '&:hover': {
      border: '2px solid #96b633',
      backgroundColor: 'rgba(150, 182, 51, 0.08)'
    }
  },
  chooserItemDisabled: {
    cursor: 'not-allowed',
    color: 'rgba(0, 0, 0, 0.54)',
    '&:hover': {
      border: '2px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: 'inherit'
    }

  },
  chooserItemTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  chooserItemDesc: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(1)
  }
}))

const Chooser = (props) => {
  const classes = useStyles()
  const { question, options, onChange, value, disabled } = props

  const [selectedOption, setSelectedOption] = useState(value)

  const handleClick = (event, value) => {
    event.preventDefault()
    if (selectedOption !== value) {
      setSelectedOption(value)
      onChange({ option: value })
    } else {
      setSelectedOption(undefined)
      onChange({ option: undefined })
    }
  }

  return (
    <>
      <Typography variant="h6"
        dangerouslySetInnerHTML={{ __html: question }}
      />
      <RadioGroup className={classes.margin} defaultValue="">
        <Grid container spacing={3}>
          { options.map((option, index) =>
            <Grid key={index} item xs={12} sm={6}>
              <label
                data-value={option.value}
                onClick={event => !disabled && handleClick(event, option.value)}
                className={clsx(classes.chooserItem, selectedOption === option.value && classes.chooserItemSelected, disabled && classes.chooserItemDisabled)}
              >
                <div className={classes.chooserItemTitle}>
                  <Radio disabled={disabled} value={option.value} color="primary" checked={selectedOption === option.value} />
                  <Typography>{option.label}</Typography>
                </div>
                <FormHelperText className={classes.chooserItemDesc} dangerouslySetInnerHTML={{ __html: option.description }} />
              </label>
            </Grid>
          ) }
        </Grid>
      </RadioGroup>
    </>
  )
}

Chooser.defaultProps = {
  onChange: event => console.log('change', event.value)
}

export default Chooser
