import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InputField from '../Gurb/components/InputField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { t } from 'i18next'

import AddressField from '../../components/AddressField'
import SelectField from '../../components/SelectField'
import PhoneField from '../../components/PhoneField'
import CalendarField from '../../components/CalendarField'
import { handleChange } from '../../utils/commonHandles'

const languages = {
  es_ES: 'Español',
  ca_ES: 'Català',
  eu_ES: 'Euskera',
  gl_ES: 'Galego'
}

const gender_options = {
  woman: t('GENDER_WOMAN'),
  man: t('GENDER_MAN'),
  genderfluid: t('GENDER_FLUID'),
  nonbinary: t('GENDER_NON_BINARY'),
  others: t('GENDER_OTHERS'),
  nottosay: t('GENDER_NOT_SAY')
}

const how_meet_us_options = {
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

const PhysicalMemberPersonalData = (props) => {
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

  function handleChangeBirthdate(value) {
    setFieldValue('new_member.birthdate', value)
  }

  const handleCheckboxChange = (event) => {
    let value = event.target.checked
    setFieldValue('new_member.privacy_policy_accepted', value)
    setFieldTouched('new_member.privacy_policy_accepted', true)
  }

  function handleChangePhone(value) {
    setFieldValue('new_member.phone1', value)
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">
          {t('MEMBER_PAGE_PERSONAL_DATA')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.name'}
              textFieldName={t('NAME')}
              handleChange={(event) => {
                handleChange(event, setFieldValue)
              }}
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
              textFieldName={t('HOLDER_SURNAME1')}
              handleChange={(event) => {
                handleChange(event, setFieldValue)
              }}
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
              textFieldName={t('HOLDER_SURNAME2')}
              handleChange={(event) => {
                handleChange(event, setFieldValue)
              }}
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
              addressLabel={t('GURB_TAX_ADDRESS_FIELD')}
              {...props}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name="email"
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
            <PhoneField
              name={'new_member.phone1'}
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
            <SelectField
              label={t('HOW_MEET_US')}
              value={values?.new_member?.how_meet_us}
              fieldName="new_member.how_meet_us"
              options={how_meet_us_options}
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
      <Grid item xs={12}>
        <Typography variant="body.xs.regular" color="secondary.dark">
          {t('GURB_NEW_MEMBER_RIGHTS')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.xs.regular" color="secondary.dark">
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

export default PhysicalMemberPersonalData