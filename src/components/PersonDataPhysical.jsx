import { useTranslation } from 'react-i18next'
import { useRef, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import InputField from './InputField'
import AddressField from './AddressField'
import SelectField from './SelectField'
import PhoneField from './PhoneField'
import CalendarField from './CalendarField'
import { useHandleChange } from '../hooks/useHandleChange'
import { useHandleBlur } from '../hooks/useHandleBlur'

const PersonDataPhysical = (props) => {
  const {
    entity = 'person',
    title = true,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
  } = props

  const { i18n, t } = useTranslation()

  const didSetInitialLanguage = useRef(false)

  useEffect(() => {
    if (!didSetInitialLanguage.current) {
      const newLanguage = `${i18n.language}_ES`
      setFieldValue(`${entity}.language`, newLanguage)
      didSetInitialLanguage.current = true
    }
  }, [i18n.language, setFieldValue])

  const handleChange = useHandleChange(setFieldValue)
  const handleBlur = useHandleBlur(setFieldTouched)

  const languages = {
    es_ES: 'Español',
    ca_ES: 'Català'
  }

  const referral_source_options = {
    '': t('SELECT_OPTION'),
    O1_SOM_SERVEIS: t('HOW_MEET_US_OPTION_1'),
    O2_ALTRES_COOPS: t('HOW_MEET_US_OPTION_2'),
    O3_OPCIONS: t('HOW_MEET_US_OPTION_3'),
    O4_ABACUS: t('HOW_MEET_US_OPTION_4'),
    O5_RECOMANAT: t('HOW_MEET_US_OPTION_5'),
    O6_JA_CONTRACTAT: t('HOW_MEET_US_OPTION_6'),
    O7_PUBLICITAT: t('HOW_MEET_US_OPTION_7'),
    O8_XARXES_SOCIALS: t('HOW_MEET_US_OPTION_8'),
    O9_ALTRES: t('HOW_MEET_US_OPTION_9')
  }

  const gender_options = {
    '': t('SELECT_OPTION'),
    female: t('GENDER_WOMAN'),
    male: t('GENDER_MAN'),
    gender_fluid: t('GENDER_FLUID'),
    non_binary: t('GENDER_NON_BINARY'),
    other: t('GENDER_OTHERS'),
    prefer_not_to_say: t('GENDER_NOT_SAY')
  }

  function handleChangeBirthdate(value) {
    setFieldValue(`${entity}.birthdate`, value)
  }

  return (
    <Grid container spacing={4}>
      {title && (
        <Grid item xs={12}>
          <Typography variant="headline4.regular">
            {t('MEMBER_PAGE_PERSONAL_DATA')}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <InputField
              name={`${entity}.name`}
              textFieldName={t('NAME')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched[entity]?.name}
              value={values[entity].name}
              error={errors[entity]?.name}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              name={`${entity}.surname1`}
              textFieldName={t('HOLDER_SURNAME1')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched[entity]?.surname1}
              value={values[entity]?.surname1}
              error={errors[entity]?.surname1}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              name={`${entity}.surname2`}
              textFieldName={t('HOLDER_SURNAME2')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched[entity]?.surname2}
              value={values[entity]?.surname2}
              error={errors[entity]?.surname2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectField
              label={t('GENDER')}
              value={values[entity]?.gender}
              fieldName={`${entity}.gender`}
              options={gender_options}
              {...props}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CalendarField
              textFieldName={t('BIRTHDATE')}
              handleChange={handleChangeBirthdate}
              value={values[entity]?.birthdate}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AddressField
              addressFieldName="address"
              addressLabel={t('ADDRESS')}
              {...props}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name={`${entity}.email`}
              textFieldName={t('EMAIL')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched[entity]?.email}
              value={values[entity]?.email}
              error={errors[entity]?.email}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name={`${entity}.email2`}
              textFieldName={t('HOLDER_EMAIL_2')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched[entity]?.email2}
              value={values[entity]?.email2}
              error={errors[entity]?.email2}
              required={true}
              onPaste={(e) => e.preventDefault()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PhoneField
              name={`${entity}.phone`}
              textFieldName={t('MEMBER_PHONE_LABEL')}
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectField
              label={t('HOW_MEET_US')}
              value={values[entity]?.referral_source}
              fieldName={`${entity}.referral_source`}
              options={referral_source_options}
              {...props}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <SelectField
              required={true}
              label={t('GURB_LANGUAGE_FIELD')}
              value={values[entity]?.language}
              fieldName={`${entity}.language`}
              options={languages}
              {...props}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PersonDataPhysical
