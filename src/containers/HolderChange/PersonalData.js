import React, { useState } from 'react'
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
import TermsDialog from '../../components/TermsDialog'
import VATField from '../../components/VATField'

import { languages } from '../../services/utils'

import generalTerms from '../../data/HolderChange/generalterms'

function PersonalData (props) {
  const { t } = useTranslation()
  const { values, setFieldValue, validateForm, handleChange, handleBlur, errors, touched } = props

  const [open, setOpen] = useState(false)

  const onChangeProxyVAT = ({ vat, valid }) => {
    setFieldValue('holder.proxynif', vat)
    setFieldValue('holder.proxynif_valid', valid)
    validateForm()
  }

  const onChangeStateCity = ({ state, city }) => {
    setFieldValue('holder.state', state)
    setFieldValue('holder.city', city)
    validateForm()
  }

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('privacy_policy_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('privacy_policy_accepted', false)
  }

  const handleChangePhone = (event) => {
    let value = event.target.value
    value = value.match(/[0-9]{0,14}/)
    value = value[0]
    setFieldValue(event.target.name, value)
  }

  return (
    <>
      <StepHeader title={t('HOLDER_PERSONAL_DATA')} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            id="holder_name"
            name="holder.name"
            label={values.holder.isphisical ? t('HOLDER_NAME') : t('BUSINESS_NAME') }
            variant="outlined"
            fullWidth
            autoFocus
            required
            value={values?.holder?.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.holder?.name && touched?.holder?.name}
            helperText={(touched?.holder?.name && errors?.holder?.name)}
          />
        </Grid>
        { values.holder.isphisical
          ? <>
            <Grid item xs={12} sm={4}>
              <TextField
                id="holder_surname1"
                name="holder.surname1"
                label={t('HOLDER_SURNAME1')}
                variant="outlined"
                fullWidth
                required
                value={values?.holder?.surname1}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.holder?.surname1 && touched?.holder?.surname1}
                helperText={(touched?.holder?.surname1 && errors?.holder?.surname1)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="holder_surname2"
                name="holder.surname2"
                label={t('HOLDER_SURNAME2')}
                variant="outlined"
                fullWidth
                value={values?.holder?.surname2}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.holder?.surname2 && touched?.holder?.surname2}
                helperText={(touched?.holder?.surname2 && errors?.holder?.surname2)}
              />
            </Grid>
          </>
          : <>
            <Grid item xs={12} sm={4}>
              <TextField
                id="proxyname"
                name="holder.proxyname"
                label={t('PROXY_NAME')}
                required
                values={values.holder.proxyname}
                variant="outlined"
                fullWidth
                value={values?.holder?.proxyname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.holder?.proxyname && touched?.holder?.proxyname}
                helperText={(touched?.holder?.proxyname && errors?.holder?.proxyname)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <VATField
                id="proxynif"
                name="holder.proxynif"
                label={t('PROXY_NIF')}
                variant="outlined"
                fullWidth
                required
                value={values?.holder?.proxynif}
                onChange={onChangeProxyVAT}
                onBlur={handleBlur}
                error={(errors?.holder?.proxynif && touched?.holder?.proxynif) ||
                  (touched?.holder?.proxynif && values?.holder?.proxynif_valid === false)
                }
                helperText={(touched?.holder?.proxynif && errors?.holder?.proxynif) ||
                  (touched?.holder?.proxynif && errors?.holder?.proxynif_valid)
                }
              />
            </Grid>
          </>
        }
        <Grid item xs={12} sm={8}>
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
            value={values?.holder?.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.holder?.address && touched?.holder?.address}
            helperText={(touched?.holder?.address && errors?.holder?.address)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id="holder_postalcode"
            name="holder.postal_code"
            label={t('HOLDER_POSTALCODE')}
            variant="outlined"
            required
            fullWidth
            value={values?.holder?.postal_code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.holder?.postal_code && touched?.holder?.postal_code}
            helperText={touched?.holder?.postal_code && errors?.holder?.postal_code}
          />
        </Grid>

        <StateCity
          stateId="holder_state"
          stateName="holder.state"
          stateInitial={values?.holder?.state}
          stateError={errors?.holder?.state && touched?.holder?.state}
          stateHelperText={touched?.holder?.state && errors?.holder?.state}
          cityId="holder_city"
          cityName="holder.city"
          cityInitial={values?.holder?.city}
          cityError={errors?.holder?.city && touched?.holder?.city}
          cityHelperText={touched?.holder?.city && errors?.holder?.city}
          onChange={onChangeStateCity}
        />

        <Grid item xs={12} sm={6}>
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
            value={values?.holder?.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.holder?.email && touched?.holder?.email}
            helperText={(touched?.holder?.email && errors?.holder?.email)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            value={values?.holder?.email2}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.holder?.email2 && touched?.holder?.email2}
            helperText={(touched?.holder?.email2 && errors?.holder?.email2)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            value={values?.holder?.phone1}
            onChange={handleChangePhone}
            onBlur={handleBlur}
            error={errors?.holder?.phone1 && touched?.holder?.phone1}
            helperText={(touched?.holder?.phone1 && errors?.holder?.phone1)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            value={values?.holder?.phone2}
            onChange={handleChangePhone}
            onBlur={handleBlur}
            error={errors?.holder?.phone2 && touched?.holder?.phone2}
            helperText={(touched?.holder?.phone2 && errors?.holder?.phone2)}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField
            select
            required
            fullWidth
            id="holder_lang"
            name="holder.language"
            label={t('LANGUAGE')}
            value={values?.holder?.language}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.holder?.phone2 && touched?.holder?.phone2}
            helperText={(touched?.holder?.phone2 && errors?.holder?.phone2) ? errors?.holder?.phone2 : t('HOLDER_LANGUAGE_HELP')}
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <LanguageOutlinedIcon />
                </InputAdornment>
            }}
            variant="outlined"
          >
            {
              Object.keys(languages).map(id => (
                <MenuItem key={id} value={id}>{languages[id]}</MenuItem>
              ))
            }
          </TextField>
        </Grid>

        <TermsDialog
          title={t('PRIVACY_POLICY_TITLE')}
          content={generalTerms}
          open={open}
          onAccept={handleAccept}
          onClose={handleClose}
        />

        <Grid item xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  id="privacy_policy_accepted"
                  color="primary"
                  name="privacy_policy_accepted"
                  onClick={handleClick}
                  checked={values?.privacy_policy_accepted}
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
