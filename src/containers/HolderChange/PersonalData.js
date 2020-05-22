import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined'
import PhoneAndroidOutlinedIcon from '@material-ui/icons/PhoneAndroidOutlined'
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined'

import StepHeader from '../../components/StepHeader'
import StateCity from '../../components/StateCity'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  }
}))

function PersonalData (props) {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <>
      <StepHeader title={t('HOLDER_PERSONAL_DATA')} />
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            id="holder_name"
            label={props.values.holder.isphisical ? t('HOLDER_NAME') : t('BUSINESS_NAME') }
            variant="outlined"
            fullWidth
            autoFocus
            required
          />
        </Grid>
        { props.values.isphisical
          ? <>
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
          </>
          : <>
            <Grid item xs={4}>
              <TextField
                id="proxyname"
                label={t('PROXY_NAME')}
                required
                values={props.values.holder.proxyname}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="proxyvat"
                label={t('PROXY_NIF')}
                values={props.values.holder.proxyvat}
                required
                variant="outlined"
                fullWidth
              />
            </Grid>
          </>
        }
        <Grid item xs={8}>
          <TextField
            id="holder_address"
            label={t('HOLDER_ADDRESS')}
            required
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

        <StateCity
          stateId="holder_state"
          stateName="holder.state"
          cityId="holder_city"
          cityName="holder.city"
        />

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
            <MenuItem key="es" value="es">Español</MenuItem>
            <MenuItem key="ca" value="ca">Català</MenuItem>
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
