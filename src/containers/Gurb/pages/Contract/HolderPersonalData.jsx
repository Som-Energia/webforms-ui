import { useTranslation } from 'react-i18next'

import InputField from '../../components/InputField'

import Grid from '@mui/material/Grid'

const HolderPersonalData = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched
  } = props

  const { t } = useTranslation()

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

  return (
    <Grid container spacing={2}>
      <Grid item sm={4} xs={12}>
        <InputField
          name={'holder.name'}
          textFieldLabel={t('NAME')}
          textFieldName={t('NAME')}
          handleChange={handleChangeName}
          handleBlur={() => {
            setFieldTouched('holder.name', true)
          }}
          touched={touched?.holder?.name}
          value={values?.holder.name}
          error={errors?.holder?.name}
          required={true}
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <InputField
          name={'holder.surname1'}
          textFieldLabel={t('HOLDER_SURNAME1')}
          textFieldName={t('HOLDER_SURNAME1')}
          handleChange={handleChangeName}
          handleBlur={() => {
            setFieldTouched('holder.surname1', true)
          }}
          touched={touched?.holder?.surname1}
          value={values?.holder.surname1}
          error={errors?.holder?.surname1}
          required={true}
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <InputField
          name={'holder.surname2'}
          textFieldLabel={t('HOLDER_SURNAME2')}
          textFieldName={t('HOLDER_SURNAME2')}
          handleChange={handleChangeName}
          handleBlur={() => {
            setFieldTouched('holder.surname2', true)
          }}
          touched={touched?.holder?.surname2}
          value={values?.holder.surname2}
          error={errors?.holder?.surname2}
          required={true}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <InputField
          name="email"
          textFieldLabel={t('EMAIL')}
          textFieldName={t('EMAIL')}
          handleChange={(event) => {
            setFieldValue('holder.email', event.target.value)
          }}
          handleBlur={() => {
            setFieldTouched('holder.email', true)
          }}
          touched={touched?.holder?.email}
          value={values?.holder.email}
          error={errors?.holder?.email}
          required={true}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <InputField
          name="repeat_email"
          textFieldLabel={t('HOLDER_EMAIL_2')}
          textFieldName={t('HOLDER_EMAIL_2')}
          handleChange={(event) => {
            setFieldValue('holder.email2', event.target.value)
          }}
          handleBlur={() => {
            setFieldTouched('holder.email2', true)
          }}
          touched={touched?.holder?.email2}
          value={values?.holder.email2}
          error={errors?.holder?.email2}
          required={true}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <InputField
          name={'holder.phone1'}
          textFieldLabel={t('GURB_PHONE1_LABEL')}
          textFieldName={t('GURB_PHONE1_LABEL')}
          handleChange={handleChangePhone}
          handleBlur={() => {
            setFieldTouched('holder.phone1', true)
          }}
          touched={touched?.holder?.phone1}
          value={values?.holder.phone1}
          error={errors?.holder?.phone1}
          required={true}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <InputField
          name={'holder.phone2'}
          textFieldLabel={t('HOLDER_PHONE_2')}
          textFieldName={t('HOLDER_PHONE_2')}
          handleChange={handleChangePhone}
          handleBlur={() => {
            setFieldTouched('holder.phone2', true)
          }}
          touched={touched?.holder?.phone2}
          value={values?.holder.phone2}
          error={errors?.holder?.phone2}
        />
      </Grid>
    </Grid>
  )
}
export default HolderPersonalData
