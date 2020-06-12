import React from 'react'
import { useTranslation } from 'react-i18next'

import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined'
import PhoneAndroidOutlinedIcon from '@material-ui/icons/PhoneAndroidOutlined'

import StepHeader from '../../components/StepHeader'
import StateCity from '../../components/StateCity'
import VATField from '../../components/VATField'

function PersonalData (props) {
  const { t } = useTranslation()

  const onChangeProxyVAT = ({ vat, valid }) => {
    props.setFieldValue('holder.proxynif', vat)
    props.setFieldValue('holder.proxynif_valid', valid)
    props.validateForm()
  }

  const onChangeStateCity = ({ state, city }) => {
    props.setFieldValue('holder.state', state)
    props.setFieldValue('holder.city', city)
    props.validateForm()
  }

  return (
    <>
      <StepHeader title={t('HOLDER_PERSONAL_DATA')} />
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            id="holder_name"
            name="holder.name"
            label={props.values.holder.isphisical ? t('HOLDER_NAME') : t('BUSINESS_NAME') }
            variant="outlined"
            fullWidth
            autoFocus
            required
            value={props.values?.holder?.name}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            error={props.errors?.holder?.name && props.touched?.holder?.name}
            helperText={(props.touched?.holder?.name && props.errors?.holder?.name)}
          />
        </Grid>
        { props.values.holder.isphisical
          ? <>
            <Grid item xs={4}>
              <TextField
                id="holder_surname1"
                name="holder.surname1"
                label={t('HOLDER_SURNAME1')}
                variant="outlined"
                fullWidth
                required
                value={props.values?.holder?.surname1}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={props.errors?.holder?.surname1 && props.touched?.holder?.surname1}
                helperText={(props.touched?.holder?.surname1 && props.errors?.holder?.surname1)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="holder_surname2"
                name="holder.surname2"
                label={t('HOLDER_SURNAME2')}
                variant="outlined"
                fullWidth
                value={props.values?.holder?.surname2}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={props.errors?.holder?.surname2 && props.touched?.holder?.surname2}
                helperText={(props.touched?.holder?.surname2 && props.errors?.holder?.surname2)}
              />
            </Grid>
          </>
          : <>
            <Grid item xs={4}>
              <TextField
                id="proxyname"
                name="holder.proxyname"
                label={t('PROXY_NAME')}
                required
                values={props.values.holder.proxyname}
                variant="outlined"
                fullWidth
                value={props.values?.holder?.proxyname}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={props.errors?.holder?.proxyname && props.touched?.holder?.proxyname}
                helperText={(props.touched?.holder?.proxyname && props.errors?.holder?.proxyname)}
              />
            </Grid>
            <Grid item xs={4}>
              <VATField
                id="proxynif"
                name="holder.proxynif"
                label={t('PROXY_NIF')}
                variant="outlined"
                fullWidth
                required
                value={props.values?.holder?.proxynif}
                onChange={onChangeProxyVAT}
                onBlur={props.handleBlur}
                error={(props.errors?.holder?.proxynif && props.touched?.holder?.proxynif) ||
                  (props.touched?.holder?.proxynif && props.values?.holder?.proxynif_valid === false)
                }
                helperText={(props.touched?.holder?.proxynif && props.errors?.holder?.proxynif) ||
                  (props.touched?.holder?.proxynif && props.errors?.holder?.proxynif_valid)
                }
              />
            </Grid>
          </>
        }
        <Grid item xs={8}>
          <TextField
            id="holder_address"
            name="holder.address"
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
            value={props.values?.holder?.address}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            error={props.errors?.holder?.address && props.touched?.holder?.address}
            helperText={(props.touched?.holder?.address && props.errors?.holder?.address)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="holder_postalcode"
            name="holder.postal_code"
            label={t('HOLDER_POSTALCODE')}
            variant="outlined"
            required
            fullWidth
            value={props.values?.holder?.postal_code}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            error={props.errors?.holder?.postal_code && props.touched?.holder?.postal_code}
            helperText={props.touched?.holder?.postal_code && props.errors?.holder?.postal_code}
          />
        </Grid>

        <StateCity
          stateId="holder_state"
          stateName="holder.state"
          stateInitial={props.values?.holder?.state}
          stateError={props.errors?.holder?.state && props.touched?.holder?.state}
          stateHelperText={props.touched?.holder?.state && props.errors?.holder?.state}
          cityId="holder_city"
          cityName="holder.city"
          cityInitial={props.values?.holder?.city}
          cityError={props.errors?.holder?.city && props.touched?.holder?.city}
          cityHelperText={props.touched?.holder?.city && props.errors?.holder?.city}
          onChange={onChangeStateCity}
        />

        <Grid item xs={6}>
          <TextField
            id="holder_email"
            name="holder.email"
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
            value={props.values?.holder?.email}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            error={props.errors?.holder?.email && props.touched?.holder?.email}
            helperText={(props.touched?.holder?.email && props.errors?.holder?.email)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="holder_email2"
            name="holder.email2"
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
            value={props.values?.holder?.email2}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            error={props.errors?.holder?.email2 && props.touched?.holder?.email2}
            helperText={(props.touched?.holder?.email2 && props.errors?.holder?.email2)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="holder_phone"
            name="holder.phone1"
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
            value={props.values?.holder?.phone1}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            error={props.errors?.holder?.phone1 && props.touched?.holder?.phone1}
            helperText={(props.touched?.holder?.phone1 && props.errors?.holder?.phone1)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="holder_phone2"
            name="holder.phone2"
            label={t('HOLDER_PHONE_2')}
            variant="outlined"
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <PhoneAndroidOutlinedIcon />
                </InputAdornment>
            }}
            fullWidth
            value={props.values?.holder?.phone2}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            error={props.errors?.holder?.phone2 && props.touched?.holder?.phone2}
            helperText={(props.touched?.holder?.phone2 && props.errors?.holder?.phone2)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            required
            fullWidth
            id="holder_lang"
            name="holder.language"
            label={t('LANGUAGE')}
            value={props.values?.holder?.language}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            error={props.errors?.holder?.phone2 && props.touched?.holder?.phone2}
            helperText={(props.touched?.holder?.phone2 && props.errors?.holder?.phone2) ? props.errors?.holder?.phone2 : t('HOLDER_LANGUAGE_HELP')}
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <LanguageOutlinedIcon />
                </InputAdornment>
            }}
            variant="outlined"
          >
            <MenuItem key="es" value="es">Español</MenuItem>
            <MenuItem key="ca" value="ca">Català</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  id="privacy_policy_accepted"
                  color="primary"
                  name="privacy_policy_accepted"
                  onChange={props.handleChange}
                  checked={props?.values?.privacy_policy_accepted}
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
