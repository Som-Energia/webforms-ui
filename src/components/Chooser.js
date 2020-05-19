import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

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
    margin: theme.spacing(1)
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
    minHeight: '124px',
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    border: '2px solid rgba(0, 0, 0, 0.12)',
    '&:hover': {
      border: '2px solid rgba(0, 0, 0, 0.87)'
    }
  },
  chooserItemTitle: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const Chooser = (props) => {
  const classes = useStyles()
  const { question, options, onChange } = props

  return (
    <>
      <Typography variant="h6"
        dangerouslySetInnerHTML={{ __html: question }}
      />
      <RadioGroup onChange={onChange} defaultValue="">
        <Grid container spacing={3}>
          { options.map((option, index) =>
            <Grid key={index} item xs={12} sm={6}>
              <label className={classes.chooserItem}>
                <div className={classes.chooserItemTitle}>
                  <Radio value={option.value} color="primary" />
                  <Typography>{option.label}</Typography>
                </div>
                <FormHelperText dangerouslySetInnerHTML={{ __html: option.description }} />
              </label>
            </Grid>
          ) }
        </Grid>
      </RadioGroup>
    </>
  )
}

Chooser.defaultProps = {
  onChange: event => console.log(event.target.value)
}

export default Chooser
