import { useTranslation } from 'react-i18next'
import { useRef, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import InputField from '../../components/InputField'
import AddressField from '../../components/AddressField'
import SelectField from '../../components/SelectField'
import PhoneField from '../../components/PhoneField'
import CalendarField from '../../components/CalendarField'
import { useHandleChange } from '../../hooks/useHandleChange'
import { useHandleBlur } from '../../hooks/useHandleBlur'

const languages = {
  es_ES: 'Español',
  ca_ES: 'Català',
  eu_ES: 'Euskera',
  gl_ES: 'Galego'
}

const PhysicalMemberPersonalData = (props) => {
  
  const { values, errors, touched, setFieldValue, setFieldTouched } = props

  const { i18n, t } = useTranslation()

  const didSetInitialLanguage = useRef(false)

  useEffect(() => {
    if (!didSetInitialLanguage.current) {
      const newLanguage = `${i18n.language}_ES`
      setFieldValue('new_member.language', newLanguage)
      didSetInitialLanguage.current = true
    }
  }, [i18n.language, setFieldValue])

  const gender_options = {
    '': t('SELECT_OPTION'),
    female: t('GENDER_WOMAN'),
    male: t('GENDER_MAN'),
    gender_fluid: t('GENDER_FLUID'),
    non_binary: t('GENDER_NON_BINARY'),
    other: t('GENDER_OTHERS'),
    prefer_not_to_say: t('GENDER_NOT_SAY')
  }

  const referral_source_options = {
    O1: t('HOW_MEET_US_OPTION_1'),
    O2: t('HOW_MEET_US_OPTION_2'),
    O3: t('HOW_MEET_US_OPTION_3'),
    O4: t('HOW_MEET_US_OPTION_4'),
    O5: t('HOW_MEET_US_OPTION_5'),
    O6: t('HOW_MEET_US_OPTION_6'),
    O7: t('HOW_MEET_US_OPTION_7'),
    O8: t('HOW_MEET_US_OPTION_8'),
    O9: t('HOW_MEET_US_OPTION_9')
  }

  const handleChange = useHandleChange(setFieldValue)
  const handleBlur = useHandleBlur(setFieldTouched)

  function handleChangeBirthdate(value) {
    setFieldValue('new_member.birthdate', value)
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t('MEMBER_PAGE_PERSONAL_DATA')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.name'}
              textFieldName={t('NAME')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched?.new_member?.name}
              value={values?.new_member.name}
              error={errors?.new_member?.name}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.surname1'}
              textFieldName={t('HOLDER_SURNAME1')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched?.new_member?.surname1}
              value={values?.new_member.surname1}
              error={errors?.new_member?.surname1}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.surname2'}
              textFieldName={t('HOLDER_SURNAME2')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched?.new_member?.surname2}
              value={values?.new_member.surname2}
              error={errors?.new_member?.surname2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectField
              label={t('GENDER')}
              value={values?.new_member?.gender}
              fieldName="new_member.gender"
              options={gender_options}
              {...props}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CalendarField
              textFieldName={t('BIRTHDATE')}
              handleChange={handleChangeBirthdate}
              value={values?.new_member.birthdate}
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
              name="new_member.email"
              textFieldName={t('EMAIL')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched?.new_member?.email}
              value={values?.new_member.email}
              error={errors?.new_member?.email}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name="new_member.email2"
              textFieldName={t('HOLDER_EMAIL_2')}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched?.new_member?.email2}
              value={values?.new_member.email2}
              error={errors?.new_member?.email2}
              required={true}
              onPaste={(e) => e.preventDefault()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PhoneField
              name={'new_member.phone'}
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
              value={values?.new_member?.referral_source}
              fieldName="new_member.referral_source"
              options={referral_source_options}
              {...props}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <SelectField
              required={true}
              label={t('GURB_LANGUAGE_FIELD')}
              value={values?.new_member?.language}
              fieldName="new_member.language"
              options={languages}
              {...props}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PhysicalMemberPersonalData
