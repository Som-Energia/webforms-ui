import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { t } from 'i18next'

import InputField from '../../components/InputField'
import AddressField from '../../components/AddressField'
import SelectField from '../../components/SelectField'
import PhoneField from '../../components/PhoneField'
import { handleChange } from '../../utils/commonHandles'

const languages = {
  es_ES: 'Español',
  ca_ES: 'Català',
  eu_ES: 'Euskera',
  gl_ES: 'Galego',
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
  O9: t('HOW_MEET_US_OPTION_9'),
}

const LegalMemberPersonalData = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setErrors,
  } = props
  const { i18n, t } = useTranslation()

  const handleCheckboxPrivacyPolicy = (event) => {
    let value = event.target.checked
    setFieldValue('new_member.privacy_policy_accepted', value)
    setFieldTouched('new_member.privacy_policy_accepted', true)
  }

  const handleCheckboxLegalPerson = (event) => {
    let value = event.target.checked
    setFieldValue('new_member.legal_person_accepted', value)
    setFieldTouched('new_member.legal_person_accepted', true)
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
              textFieldName={t('BUSINESS_NAME')}
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
              name={'new_member.proxyname'}
              textFieldName={t('PROXY_NAME')}
              handleChange={(event) => {
                handleChange(event, setFieldValue)
              }}
              handleBlur={() => {
                setFieldTouched('new_member.proxyname', true)
              }}
              touched={touched?.new_member?.proxyname}
              value={values?.new_member.proxyname}
              error={errors?.new_member?.proxyname}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.proxynif'}
              textFieldName={t('PROXY_NIF')}
              handleChange={(event) => {
                handleChange(event, setFieldValue)
              }}
              handleBlur={() => {
                setFieldTouched('new_member.proxynif', true)
              }}
              touched={touched?.new_member?.proxynif}
              value={values?.new_member.proxynif}
              error={errors?.new_member?.proxynif}
              required={true}
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
          control={
            <Checkbox
              data-cy="privacy_policy"
              checked={values?.new_member.privacy_policy_accepted}
              onChange={handleCheckboxPrivacyPolicy}
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('ACCEPT_PRIVACY_POLICY', {
                  url: t('ACCEPT_PRIVACY_POLICY_URL'),
                }),
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="legal_person"
              checked={values?.new_member.legal_person_accepted}
              onChange={handleCheckboxLegalPerson}
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('LEGAL_PERSON_TITLE_LABEL')
              }}
            />
          }
        />
      </Grid>
    </Grid>
  )
}

export default LegalMemberPersonalData
