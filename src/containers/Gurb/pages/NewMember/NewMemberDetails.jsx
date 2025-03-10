import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  textHeader4,
  textSubtitle2,
  textCheckbox,
  textField
} from '../../gurbTheme'
import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'

import { checkVat } from '../../../../services/api'
import GurbLoadingContext from '../../../../context/GurbLoadingContext'

const languages = {
  es_ES: 'Español',
  ca_ES: 'Català',
  eu_ES: 'Euskera',
  gl_ES: 'Galego'
}

const NewMemberDetails = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setErrors
  } = props

  const { t } = useTranslation()

  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handleCheckNifResponse = async () => {
    let nif_info = undefined
    setLoading(true)
    await checkVat(values?.new_member?.nif)
      .then((response) => {
        nif_info = response?.data
      })
      .catch(() => {
        console.error('UNEXPECTED')
      })
    if (nif_info.exists === false && nif_info.valid === true) {
      await setFieldValue('new_member.become_member', true)
      setFieldError('new_member.nif', undefined)
    } else {
      await setFieldValue('new_member.become_member', false)
      setFieldError('new_member.nif', t('INVALID_NIF'))
    }

    setLoading(false)
  }

  useEffect(() => {
    if (values?.new_member?.nif && values?.new_member?.nif.length > 8) {
      handleCheckNifResponse()
    }
  }, [values.new_member.nif])

  const handleInputNif = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    value = value[0].toUpperCase()
    setFieldValue('new_member.nif', value)
  }

  const handleInputNifBlur = () => {
    setFieldTouched('new_member.nif', true)
  }

  const handleChangeName = (event) => {
    let value = event.target.value.match(/^[a-zA-Z]*/)
    value = value[0]
    setFieldValue(event.target.name, value)
  }

  const handleChangePhone = (event) => {
    let value = event.target.value.match(/[0-9]{0,14}/)
    value = value[0]
    setFieldValue(event.target.name, value)
  }

  const handleLanguageChange = (event) => {
    let value = event.target.value
    setFieldValue('new_member.language', value)
  }

  const handleCheckboxChange = (event) => {
    let value = event.target.checked
    setFieldValue('new_member.privacy_policy_accepted', value)
    setFieldTouched('new_member.privacy_policy_accepted', true)
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <TextRecomendation title={t('GURB_NEW_MEMBER_TITLE')} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputField
              name="new_member.nif"
              textFieldLabel={t('GURB_NIF_LABEL_NEW_MEMBER_FIELD')}
              textFieldName={t('GURB_NIF_FIELD')}
              textFieldHelper={t('GURB_NIF_HELPER')}
              iconHelper={true}
              handleChange={handleInputNif}
              handleBlur={handleInputNifBlur}
              touched={touched?.new_member?.nif}
              value={values?.new_member.nif}
              error={errors?.new_member?.nif}
              isLoading={loading}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.name'}
              textFieldLabel={t('NAME')}
              textFieldName={t('NAME')}
              handleChange={handleChangeName}
              handleBlur={() => {
                setFieldTouched('new_member.name', true)
              }}
              touched={touched?.new_member?.name}
              value={values?.new_member.name}
              error={errors?.new_member?.name}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.surname1'}
              textFieldLabel={t('HOLDER_SURNAME1')}
              textFieldName={t('HOLDER_SURNAME1')}
              handleChange={handleChangeName}
              handleBlur={() => {
                setFieldTouched('new_member.surname1', true)
              }}
              touched={touched?.new_member?.surname1}
              value={values?.new_member.surname1}
              error={errors?.new_member?.surname1}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.surname2'}
              textFieldLabel={t('HOLDER_SURNAME2')}
              textFieldName={t('HOLDER_SURNAME2')}
              handleChange={handleChangeName}
              handleBlur={() => {
                setFieldTouched('new_member.surname2', true)
              }}
              touched={touched?.new_member?.surname2}
              value={values?.new_member.surname2}
              error={errors?.new_member?.surname2}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name="email"
              textFieldLabel={t('EMAIL')}
              textFieldName={t('EMAIL')}
              handleChange={(event) => {
                setFieldValue('new_member.email', event.target.value)
              }}
              handleBlur={() => {
                setFieldTouched('new_member.email', true)
              }}
              touched={touched?.new_member?.email}
              value={values?.new_member.email}
              error={errors?.new_member?.email}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name="repeat_email"
              textFieldLabel={t('HOLDER_EMAIL_2')}
              textFieldName={t('HOLDER_EMAIL_2')}
              handleChange={(event) => {
                setFieldValue('new_member.email2', event.target.value)
              }}
              handleBlur={() => {
                setFieldTouched('new_member.email2', true)
              }}
              touched={touched?.new_member?.email2}
              value={values?.new_member.email2}
              error={errors?.new_member?.email2}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name={'new_member.phone1'}
              textFieldLabel={t('GURB_PHONE1_LABEL')}
              textFieldName={t('GURB_PHONE1_LABEL')}
              handleChange={handleChangePhone}
              handleBlur={() => {
                setFieldTouched('new_member.phone1', true)
              }}
              touched={touched?.new_member?.phone1}
              value={values?.new_member.phone1}
              error={errors?.new_member?.phone1}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name={'new_member.phone2'}
              textFieldLabel={t('HOLDER_PHONE_2')}
              textFieldName={t('HOLDER_PHONE_2')}
              handleChange={handleChangePhone}
              handleBlur={() => {
                setFieldTouched('new_member.phone2', true)
              }}
              touched={touched?.new_member?.phone2}
              value={values?.new_member.phone2}
              error={errors?.new_member?.phone2}
            />
          </Grid>
        </Grid>
        {/* TO DO: make a component? */}
        <Box sx={{ marginTop: '2rem' }}>
          <Typography sx={textHeader4}>{t('GURB_LANGUAGE_FIELD')}</Typography>
          <TextField
            sx={textField}
            required
            select
            fullWidth
            InputProps={{
              sx: {
                borderRadius: '8px',
                display: 'flex'
              }
            }}
            onChange={handleLanguageChange}
            value={values?.new_member.language}>
            {Object.keys(languages).map((id) => (
              <MenuItem key={id} value={id}>
                {languages[id]}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Typography sx={{ ...textSubtitle2, marginBottom: '1rem' }}>
            {t('GURB_NEW_MEMBER_RIGHTS')}
          </Typography>
          <Typography sx={textSubtitle2}>
            {t('GURB_NEW_MEMBER_THIRD_PERSON_PERSONAL_DATA')}
          </Typography>
          {/* TO DO: make a component? */}
          <FormControlLabel
            sx={{ ...textCheckbox, marginTop: '2rem' }}
            control={
              <Checkbox
                data-cy="privacy_policy"
                checked={values?.new_member.privacy_policy_accepted}
                onChange={handleCheckboxChange}
              />
            }
            label={
              <label
                dangerouslySetInnerHTML={{
                  __html: t('ACCEPT_PRIVACY_POLICY', {
                    url: t('ACCEPT_PRIVACY_POLICY_URL')
                  })
                }}
              />
            }
          />
        </Box>
      </Grid>
    </Grid>
  )
}
export default NewMemberDetails
