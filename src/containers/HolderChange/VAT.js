import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import { checkVat } from '../../services/api'

import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'

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

function VAT (props) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const { validate } = props

  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [isValidated, setValidated] = useState(false)

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    validate(isValidated)
  }, [isValidated, validate])

  useEffect(() => {
    console.log('check value!', value)
    value.length >= 8
      ? checkVat(value)
        .then(response => {
          console.log(response)
          setError((response?.data?.valid !== true))
          setValidated((response?.data?.valid === true))
        }
        )
      : setError(value.length !== 0)
  }, [value])

  return (
    <>
      <StepHeader title={t('HOLDER_CHANGE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('FILL_VAT') }}
      />
      <Box mt={3} mb={1}>
        <TextField
          id="nif"
          label={t('VAT_LABEL')}
          variant="outlined"
          fullWidth
          required
          autoFocus
          value={value}
          onChange={handleChange}
          error={error}
        />
      </Box>
      <Box mt={4} mb={3}>
        <FormHelperText dangerouslySetInnerHTML={{ __html: t('NO_VAT_HELP') }}></FormHelperText>
      </Box>
    </>
  )
}

export default VAT
