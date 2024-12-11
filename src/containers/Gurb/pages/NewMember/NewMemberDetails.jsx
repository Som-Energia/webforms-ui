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
    setErrors,
    setFieldTouched
  } = props

  const { t } = useTranslation()

  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handleCheckNifResponse = async () => {
    let status = undefined
    setLoading(true)
    await checkMemberVat(values?.member?.nif)
      .then((response) => {
        status = response?.state
      })
      .catch(() => {
        status = false
      })
    if (status === false) {
      await setFieldError('member.nif', t('INVALID_NIF'))
      setFieldTouched('member.nif', true)
    } else {
      setErrors({})
    }
    setLoading(false)
  }

  useEffect(() => {
    if (values?.member?.nif) {
      handleCheckNifResponse()
    }
  }, [values.member.nif])

  const handleInputNif = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    value = value[0].toUpperCase()
    setFieldValue('member.nif', value)
  }

  const handleInputNifBlur = () => {
    setFieldTouched('member.nif', true)
  }

  const handleLanguageChange = (event) => {
    let value = event.target.value
    setFieldValue('member.language', value)
  }

  const handleCheckboxChange = (event) => {
    let value = event.target.value
    setFieldValue('member.privacy_policy_accepted', value)
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
        touched={touched?.member?.nif}
        value={values?.member.nif}
        error={errors?.member?.nif}
        isLoading={loading}
      />
      <Grid container columnSpacing={2}>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('NAME')}
            textFieldName={t('NAME')}
            handleChange={(event) => {
              setFieldValue('member.name', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('member.name', true)
            }}
            touched={touched?.member?.name}
            value={values?.member.name}
            error={errors?.member?.name}
          />
        </Grid>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('HOLDER_SURNAME1')}
            textFieldName={t('HOLDER_SURNAME1')}
            handleChange={(event) => {
              setFieldValue('member.surname1', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('member.surname1', true)
            }}
            touched={touched?.member?.surname1}
            value={values?.member.surname1}
            error={errors?.member?.surname1}
          />
        </Grid>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('HOLDER_SURNAME2')}
            textFieldName={t('HOLDER_SURNAME2')}
            handleChange={(event) => {
              setFieldValue('member.surname2', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('member.surname2', true)
            }}
            touched={touched?.member?.surname2}
            value={values?.member.surname2}
            error={errors?.member?.surname2}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            textFieldLabel={t('EMAIL')}
            textFieldName={t('EMAIL')}
            handleChange={(event) => {
              setFieldValue('member.email', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('member.email', true)
            }}
            touched={touched?.member?.email}
            value={values?.member.email}
            error={errors?.member?.email}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            textFieldLabel={t('HOLDER_EMAIL_2')}
            textFieldName={t('HOLDER_EMAIL_2')}
            handleChange={(event) => {
              setFieldValue('member.email2', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('member.email2', true)
            }}
            touched={touched?.member?.email2}
            value={values?.member.email2}
            error={errors?.member?.email2}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            textFieldLabel={t('GURB_PHONE1_LABEL')}
            textFieldName={t('GURB_PHONE1_LABEL')}
            handleChange={(event) => {
              setFieldValue('member.phone1', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('member.phone1', true)
            }}
            touched={touched?.member?.phone1}
            value={values?.member.phone1}
            error={errors?.member?.phone1}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            textFieldLabel={t('HOLDER_PHONE_2')}
            textFieldName={t('HOLDER_PHONE_2')}
            handleChange={(event) => {
              setFieldValue('member.phone2', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('member.phone2', true)
            }}
            touched={touched?.member?.phone2}
            value={values?.member.phone2}
            error={errors?.member?.phone2}
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
          value={values?.member.language}>
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
        <FormControlLabel
          sx={{ ...textCheckbox, marginTop: '2rem' }}
          control={<Checkbox />}
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('ACCEPT_PRIVACY_POLICY', {
                  url: t('ACCEPT_PRIVACY_POLICY_URL')
                })
              }}
            />
          }
          labelPlacement="end"
          onChange={handleCheckboxChange}
        />
      </Box>
    </>
  )
}
export default NewMemberDetails
