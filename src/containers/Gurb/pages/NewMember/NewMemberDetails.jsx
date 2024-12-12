import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { textHeader4, textSubtitle2, textCheckbox } from '../../gurbTheme'
import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'

import { checkMemberVat } from '../../../../services/api'
import GurbLoadingContext from '../../../../context/GurbLoadingContext'
import GurbErrorContext from '../../../../context/GurbErrorContext'

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
    setFieldTouched
  } = props

  const { t } = useTranslation()

  const { loading, setLoading } = useContext(GurbLoadingContext)
  const { setError, setErrorInfo } = useContext(GurbErrorContext)

  const handleCheckNifResponse = async () => {
    setLoading(true)
    await checkMemberVat(values?.member?.nif)
      .then((response) => {
        if (response?.state === false) {
          setFieldError('new_member.nif', t('INVALID_NIF'))
          setFieldValue('new_member.become_member', false)
        } else {
          setFieldError('new_member.nif', undefined)
          setFieldValue('new_member.become_member', true)
        }
      })
      .catch(() => {
        console.error('UNEXPECTED')
      })

    setLoading(false)
  }

  useEffect(() => {
    if (values?.new_member?.nif && values?.new_member?.nif.length > 8) {
      handleCheckNifResponse()
    }
  }, [values.new_member.nif])

  useEffect(() => {
    if (
      errors.new_member === undefined &&
      values.new_member.become_member === true
    ) {
      setError(true)
      setErrorInfo({
        main_text: t('GURB_WELCOME_NEW_MEMBER_MAIN_TEXT'),
        seconday_text: t('GURB_WELCOME_NEW_MEMBER_SECONDARY_TEXT'),
        error_type: 'success'
      })
    }
  }, [])

  const handleInputNif = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    value = value[0].toUpperCase()
    setFieldValue('new_member.nif', value)
  }

  const handleInputNifBlur = () => {
    setFieldTouched('new_member.nif', true)
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
    <>
      <TextRecomendation title={t('GURB_NEW_MEMBER_TITLE')} />
      <InputField
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
      />
      <Grid container columnSpacing={2}>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('NAME')}
            textFieldName={t('NAME')}
            handleChange={(event) => {
              setFieldValue('new_member.name', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('new_member.name', true)
            }}
            touched={touched?.new_member?.name}
            value={values?.new_member.name}
            error={errors?.new_member?.name}
          />
        </Grid>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('HOLDER_SURNAME1')}
            textFieldName={t('HOLDER_SURNAME1')}
            handleChange={(event) => {
              setFieldValue('new_member.surname1', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('new_member.surname1', true)
            }}
            touched={touched?.new_member?.surname1}
            value={values?.new_member.surname1}
            error={errors?.new_member?.surname1}
          />
        </Grid>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('HOLDER_SURNAME2')}
            textFieldName={t('HOLDER_SURNAME2')}
            handleChange={(event) => {
              setFieldValue('new_member.surname2', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('new_member.surname2', true)
            }}
            touched={touched?.new_member?.surname2}
            value={values?.new_member.surname2}
            error={errors?.new_member?.surname2}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
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
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
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
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            textFieldLabel={t('GURB_PHONE1_LABEL')}
            textFieldName={t('GURB_PHONE1_LABEL')}
            handleChange={(event) => {
              setFieldValue('new_member.phone1', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('new_member.phone1', true)
            }}
            touched={touched?.new_member?.phone1}
            value={values?.new_member.phone1}
            error={errors?.new_member?.phone1}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            textFieldLabel={t('HOLDER_PHONE_2')}
            textFieldName={t('HOLDER_PHONE_2')}
            handleChange={(event) => {
              setFieldValue('new_member.phone2', event.target.value)
            }}
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
          sx={{
            '& .MuiFormHelperText-root': { color: '#B3B3B3' },
            '& .MuiInputLabel-root': { color: '#B3B3B3' },
            marginTop: '0.5rem'
          }}
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
    </>
  )
}
export default NewMemberDetails
