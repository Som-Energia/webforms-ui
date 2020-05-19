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

function CUPS (props) {
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
    value.length >= 10
      ? checkVat(value)
        .then(response => {
          console.log(response)
          setError((response?.data?.valid !== true))
          console.log('validated?', response?.data?.valid)
          setValidated((response?.data?.valid === true))
        }
        )
      : setError(value.length !== 0)
  }, [value])

  return (
    <>
      <StepHeader title={t('CUPS_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('FILL_CUPS') }}
      />
      <Box mt={3} mb={1}>
        <TextField
          id="cups"
          label={t('CUPS_LABEL')}
          variant="outlined"
          fullWidth
          autoFocus
          required
          helperText={
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={t('CUPS_HELP_URL')}>
              {t('CUPS_HELP')}
            </a>
          }
          value={value}
          onChange={handleChange}
          error={error}
        />
      </Box>
      <Box mt={3} mb={1}>
        <TextField
          id="cupsaddress"
          label={t('SUPPLY_POINT_ADDRESS')}
          variant="outlined"
          fullWidth
          disabled
          value={value}
        />
      </Box>
      <Box mt={4} mb={3}>
        <FormHelperText dangerouslySetInnerHTML={{ __html: t('CUPS_NO_VERIFY_HELP') }}></FormHelperText>
      </Box>
    </>
  )
}

export default CUPS
