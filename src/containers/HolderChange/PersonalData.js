import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import { checkVat } from '../../services/api'

import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined'
import PhoneAndroidOutlinedIcon from '@material-ui/icons/PhoneAndroidOutlined'
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined'

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

function PersonalData (props) {
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
      <StepHeader title={t('HOLDER_PERSONAL_DATA')} />
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            id="holder_name"
            label={t('HOLDER_NAME')}
            variant="outlined"
            fullWidth
            autoFocus
            required
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="holder_surname1"
            label={t('HOLDER_SURNAME1')}
            variant="outlined"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="holder_surname2"
            label={t('HOLDER_SURNAME2')}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            id="holder_address"
            label={t('HOLDER_ADDRESS')}
            variant="outlined"
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <HomeOutlinedIcon />
                </InputAdornment>
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="holder_postalcode"
            label={t('HOLDER_POSTALCODE')}
            variant="outlined"
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            id="holder_state"
            label={t('STATE')}
            variant="outlined"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="holder_city"
            label={t('CITY')}
            variant="outlined"
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            id="holder_email"
            label={t('HOLDER_EMAIL')}
            variant="outlined"
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
            }}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="holder_email2"
            label={t('HOLDER_EMAIL_2')}
            variant="outlined"
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
            }}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="holder_phone"
            label={t('HOLDER_PHONE')}
            variant="outlined"
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <PhoneAndroidOutlinedIcon />
                </InputAdornment>
            }}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="holder_phone2"
            label={t('HOLDER_PHONE_2')}
            variant="outlined"
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <PhoneAndroidOutlinedIcon />
                </InputAdornment>
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="holder_lang"
            select
            label={t('LANGUAGE')}
            variant="outlined"
            helperText={t('HOLDER_LANGUAGE_HELP')}
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <LanguageOutlinedIcon />
                </InputAdornment>
            }}
            fullWidth
          >
            <MenuItem key="es">Español</MenuItem>
            <MenuItem key="ca">Català</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <FormGroup row>
            <FormControlLabel
              value="holder_acceptprivacypolicy"
              control={
                <Checkbox
                  id="holder_acceptprivacypolicy"
                  color="primary"
                />
              }
              label={t('ACCEPT_PRIVACY_POLICY')}
              labelPlacement="end"
            />
          </FormGroup>
        </Grid>
      </Grid>
    </>
  )
}

export default PersonalData
