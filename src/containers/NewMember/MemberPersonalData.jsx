import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InputField from '../Gurb/components/InputField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

const MemberPersonalData = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setErrors
  } = props
  const { i18n, t } = useTranslation()

  const handleChangeName = (event) => {
    //TODO: make it possible to put accents
    let value = event.target.value //.match(/^[a-zA-Z]*/)
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
        <Typography variant="headline3">
          {'Indica el NIF de la nova persona sòcia'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
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
      </Grid>
      <Grid item xs={12}>
        <Typography>{t('GURB_NEW_MEMBER_RIGHTS')}</Typography>
        <Typography>
          {t('GURB_NEW_MEMBER_THIRD_PERSON_PERSONAL_DATA')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          //   sx={{ ...textCheckbox, marginTop: '2rem' }}
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
      </Grid>
    </Grid>
  )
}

export default MemberPersonalData
