import { useTranslation } from 'react-i18next'

import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'
import SomStepper from '../../components/SomStepper'

import Box from '@mui/material/Box'
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

  const handleChangePhone = (event) => {
    let value = event.target.value.match(/[0-9]{0,14}/)
    value = value[0]
    setFieldValue(event.target.name, value)
  }

  return (
    <>
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation
          title={t('GURB_HOLDER_PERSONAL_DATA_TITLE')}
          text={t('GURB_HOLDER_ID_SUBTITLE')}
        />
        <SomStepper step={activeStep} connectors={7 + 1} />
      </Box>
      <Grid container columnSpacing={2} sx={{ marginBottom: '6rem' }}>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('NAME')}
            textFieldName={t('NAME')}
            handleChange={(event) => {
              setFieldValue('holder.name', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('holder.name', true)
            }}
            touched={touched?.holder?.name}
            value={values?.holder.name}
            error={errors?.holder?.name}
            required={true}
          />
        </Grid>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('HOLDER_SURNAME1')}
            textFieldName={t('HOLDER_SURNAME1')}
            handleChange={(event) => {
              setFieldValue('holder.surname1', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('holder.surname1', true)
            }}
            touched={touched?.holder?.surname1}
            value={values?.holder.surname1}
            error={errors?.holder?.surname1}
            required={true}
          />
        </Grid>
        <Grid item xs={4}>
          <InputField
            textFieldLabel={t('HOLDER_SURNAME2')}
            textFieldName={t('HOLDER_SURNAME2')}
            handleChange={(event) => {
              setFieldValue('holder.surname2', event.target.value)
            }}
            handleBlur={() => {
              setFieldTouched('holder.surname2', true)
            }}
            touched={touched?.holder?.surname2}
            value={values?.holder.surname2}
            error={errors?.holder?.surname2}
            required={true}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
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
        <Grid item xs={12}>
          <InputField
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
    </>
  )
}
export default HolderPersonalData
