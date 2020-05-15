import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
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
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: '25ch'
  }
}))

function VoluntaryCent (props) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const { validate } = props

  const [value, setValue] = useState('')
  const [isValidated, setValidated] = useState(false)

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    validate(isValidated)
  }, [isValidated, validate])

  return (
    <>
      <Typography className={classes.title} variant="h5">{t('VOLUNTARY_CENT_TITLE')}</Typography>
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('VOLUNTARY_CENT_PRESENTATION') }}
      />
      <Box mt={3} mb={4}>
        <Typography variant="h6"
          dangerouslySetInnerHTML={{ __html: t('VOLUNTARY_CENT_QUESTION') }}
        />
      </Box>
    </>
  )
}

export default VoluntaryCent
