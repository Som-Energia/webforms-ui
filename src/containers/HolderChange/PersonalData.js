import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
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

import { languages } from '../../services/utils'

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  },
  noteText: {
    marginTop: theme.spacing(2)
  }
}))

function PersonalData (props) {
  const { t } = useTranslation()
  const classes = useStyles()
  const { values, setFieldValue, validateForm, handleChange, handleBlur, errors, touched, entity = 'holder' } = props

  const onChangeProxyVAT = ({ vat, valid }) => {
    setFieldValue(`${entity}.proxynif`, vat)
    setFieldValue(`${entity}.proxynif_valid`, valid)
    validateForm()
  }

  const onChangeStateCity = ({ state, city }) => {
    setFieldValue(`${entity}.state`, state, false)
    setFieldValue(`${entity}.city`, city)
  }

  const handleClick = (event) => {
    const privacyPolicyAccepted = values?.privacy_policy_accepted
    setFieldValue('privacy_policy_accepted', !privacyPolicyAccepted)
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
            id={`${entity}_name`}
            name={`${entity}.name`}
            label={values[entity]?.isphisical ? t('HOLDER_NAME') : t('BUSINESS_NAME') }
            variant="outlined"
            fullWidth
            autoFocus
            required
            value={values[entity]?.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[entity]?.name && touched[entity]?.name}
            helperText={(touched[entity]?.name && errors[entity]?.name)}
          />
        </Grid>
        { values[entity].isphisical
          ? <>
            <Grid item xs={12} sm={4}>
              <TextField
                id={`${entity}_surname1`}
                name={`${entity}.surname1`}
                label={t('HOLDER_SURNAME1')}
                variant="outlined"
                fullWidth
                required
                value={values[entity]?.surname1}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[entity]?.surname1 && touched[entity]?.surname1}
                helperText={(touched[entity]?.surname1 && errors[entity]?.surname1)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id={`${entity}_surname2`}
                name={`${entity}.surname2`}
                label={t('HOLDER_SURNAME2')}
                variant="outlined"
                fullWidth
                value={values[entity]?.surname2}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[entity]?.surname2 && touched[entity]?.surname2}
                helperText={(touched[entity]?.surname2 && errors[entity]?.surname2)}
              />
            </Grid>
          </>
          : <>
            <Grid item xs={12} sm={4}>
              <TextField
                id="proxyname"
                name={`${entity}.proxyname`}
                label={t('PROXY_NAME')}
                required
                value={values[entity]?.proxyname}
                variant="outlined"
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[entity]?.proxyname && touched[entity]?.proxyname}
                helperText={(touched[entity]?.proxyname && errors[entity]?.proxyname)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <VATField
                id="proxynif"
                name={`${entity}.proxynif`}
                label={t('PROXY_NIF')}
                variant="outlined"
                fullWidth
                required
                value={values[entity]?.proxynif}
                onChange={onChangeProxyVAT}
                onBlur={handleBlur}
                error={(errors[entity]?.proxynif && touched[entity]?.proxynif) ||
                  (touched[entity]?.proxynif && values[entity]?.proxynif_valid === false)
                }
                helperText={(touched[entity]?.proxynif && errors[entity]?.proxynif) ||
                  (touched[entity]?.proxynif && errors[entity]?.proxynif_valid)
                }
              />
            </Grid>
          </>
        }
        <Grid item xs={12} sm={8}>
          <TextField
            id={`${entity}_address`}
            name={`${entity}.address`}
            label={t('HOLDER_ADDRESS')}
            className={classes.icon}
            required
            variant="outlined"
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <HomeOutlinedIcon />
                </InputAdornment>
            }}
            fullWidth
            value={values[entity]?.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[entity]?.address && touched[entity]?.address}
            helperText={(touched[entity]?.address && errors[entity]?.address)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id={`${entity}_postalcode`}
            name={`${entity}.postal_code`}
            label={t('HOLDER_POSTALCODE')}
            variant="outlined"
            required
            fullWidth
            value={values[entity]?.postal_code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[entity]?.postal_code && touched[entity]?.postal_code}
            helperText={touched[entity]?.postal_code && errors[entity]?.postal_code}
          />
        </Grid>

        <StateCity
          stateId={`${entity}_state`}
          stateName={`${entity}.state`}
          stateInitial={values[entity]?.state}
          stateError={errors[entity]?.state && touched[entity]?.state}
          stateHelperText={touched[entity]?.state && errors[entity]?.state}
          cityId={`${entity}_city`}
          cityName={`${entity}.city`}
          cityInitial={values[entity]?.city}
          cityError={errors[entity]?.city && touched[entity]?.city}
          cityHelperText={touched[entity]?.city && errors[entity]?.city}
          onChange={onChangeStateCity}
        />

        <Grid item xs={12} sm={6}>
          <TextField
            id={`${entity}_email`}
            name={`${entity}.email`}
            className={classes.icon}
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
            value={values[entity]?.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[entity]?.email && touched[entity]?.email}
            helperText={(touched[entity]?.email && errors[entity]?.email)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id={`${entity}_email2`}
            name={`${entity}.email2`}
            className={classes.icon}
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
            value={values[entity]?.email2}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[entity]?.email2 && touched[entity]?.email2}
            helperText={(touched[entity]?.email2 && errors[entity]?.email2)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id={`${entity}_phone`}
            name={`${entity}.phone1`}
            className={classes.icon}
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
            value={values[entity]?.phone1}
            onChange={handleChangePhone}
            onBlur={handleBlur}
            error={errors[entity]?.phone1 && touched[entity]?.phone1}
            helperText={(touched[entity]?.phone1 && errors[entity]?.phone1)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id={`${entity}_phone2`}
            name={`${entity}.phone2`}
            className={classes.icon}
            label={t('HOLDER_PHONE_2')}
            variant="outlined"
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <PhoneAndroidOutlinedIcon />
                </InputAdornment>
            }}
            fullWidth
            value={values[entity]?.phone2}
            onChange={handleChangePhone}
            onBlur={handleBlur}
            error={errors[entity]?.phone2 && touched[entity]?.phone2}
            helperText={(touched[entity]?.phone2 && errors[entity]?.phone2)}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField
            select
            required
            fullWidth
            className={classes.icon}
            id={`${entity}_lang`}
            name={`${entity}.language`}
            label={t('LANGUAGE')}
            value={values[entity]?.language}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[entity]?.language && touched[entity]?.language}
            helperText={(touched[entity]?.language && errors[entity]?.language) ? errors[entity]?.language : t('HOLDER_LANGUAGE_HELP')}
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

        <Grid item mt={1} mb={0}>
          <FormHelperText
            dangerouslySetInnerHTML={
              { __html: values?.contract?.has_service === undefined
                ? entity === 'holder'
                  ? t('PRIVACY_POLICY_HOLDERCHANGE', { url: t('DATA_PROTECTION_HOLDERCHANGE_URL') })
                  : t('PRIVACY_POLICY_NEWMEMBER', { url: t('DATA_PROTECTION_NEWMEMBER_URL') })
                : t('PRIVACY_POLICY_CONTRACT', { url: t('DATA_PROTECTION_CONTRACT_URL') })
              }
            }
          />
          {
            values?.contract?.has_service === undefined
              ? <FormHelperText
                className={classes.noteText}
                dangerouslySetInnerHTML={
                  { __html: t('PRIVACY_POLICY_HOLDERCHANGE_NOTE') }
                }
              />
              : <></>
          }
        </Grid>
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
              label={
                <label dangerouslySetInnerHTML={
                  { __html: t('ACCEPT_PRIVACY_POLICY',
                    {
                      url: values?.contract?.has_service === undefined
                        ? entity === 'holder'
                          ? t('DATA_PROTECTION_HOLDERCHANGE_URL')
                          : t('DATA_PROTECTION_NEWMEMBER_URL')
                        : t('DATA_PROTECTION_CONTRACT_URL')
                    })
                  }
                }/>
              }
              labelPlacement="end"
            />
          </FormGroup>
        </Grid>
      </Grid>
    </>
  )
}

export default PersonalData
