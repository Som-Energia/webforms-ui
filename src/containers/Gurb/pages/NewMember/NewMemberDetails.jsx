import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'

import { textHeader4, textSubtitle2 } from '../../gurbTheme'
import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

import TextField from '@mui/material/TextField'

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

  const handleInputDni = (event) => {
    let value = event.target.value.match(/^[0-9A-Z][0-9]{7}[0-9A-Z]\d*$/)
    value = value[0].toUpperCase()
    setFieldValue('member.dni', value)
  }

  const handleInputDniBlur = () => {
    setFieldTouched('member.dni', true)
  }

  const handleLanguageChange = (event) => {
    let value = event.target.value
    setFieldValue('member.language', value)
  }

  return (
    <>
      <TextRecomendation title={t('GURB_NEW_MEMBER_TITLE')} />
      <InputField
        textFieldLabel={t('GURB_DNI_LABEL')}
        textFieldName={t('GURB_DNI_NEW_MEMBER_FIELD')}
        textFieldHelper={t('GURB_DNI_HELPER')}
        iconHelper={true}
        handleChange={handleInputDni}
        handleBlur={handleInputDniBlur}
        touched={touched?.member?.dni}
        value={values?.member.dni}
        error={errors?.member?.dni}
      />

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('GURB_NAME_LABEL')}
            textFieldName={t('GURB_NAME_FIELD')}
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
            textFieldLabel={t('GURB_SURNAME1_LABEL')}
            textFieldName={t('GURB_SURNAME1_FIELD')}
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
            textFieldLabel={t('GURB_SURNAME2_LABEL')}
            textFieldName={t('GURB_SURNAME2_FIELD')}
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
            textFieldLabel={t('GURB_EMAIL_LABEL')}
            textFieldName={t('GURB_EMAIL_FIELD')}
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
            textFieldLabel={t('GURB_EMAIL2_LABEL')}
            textFieldName={t('GURB_EMAIL2_LABEL')}
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
      </Grid>

      {/* TO DO: make a component */}
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
            sx: { borderRadius: '8px', display: 'flex' }
          }}
          onChange={handleLanguageChange}
          label={t('GURB_LANGUAGE_LABEL')}
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
      </Box>
    </>
  )
}
export default NewMemberDetails
