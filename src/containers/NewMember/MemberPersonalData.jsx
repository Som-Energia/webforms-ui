import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import InputField from '../Gurb/components/InputField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { textHeader4, textField } from '../Gurb/gurbTheme'
import { t } from 'i18next'

import AddressField from '../../components/AddressField'
import { handleChange } from '../../utils/commonHandles'

const languages = {
  es_ES: 'Español',
  ca_ES: 'Català',
  eu_ES: 'Euskera',
  gl_ES: 'Galego'
}

const gender_options = {
  W: t('GENDER_WOMAN'),
  M: t('GENDER_MAN'),
  N: t('GENDER_NON_BINARY')
}

const how_meet_us_options = {
  O1: 'OPTION_1',
  O2: 'OPTION_2',
  O3: 'OPTION_3'
}

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

  const handleChangeGender = (event) => {
    let value = event.target.value
    setFieldValue('new_member.gender', value)
  }

  const handleChangeBirthdate = (event) => {
    let value = event.target.value.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)
    setFieldValue('new_member.birthdate', value)
  }

  // TODO: enter international phone
  const handleChangePhone = (event) => {
    let value = event.target.value.match(/[0-9]{0,14}/)
    value = value[0]
    setFieldValue(event.target.name, value)
  }

  const handleLanguageChange = (event) => {
    let value = event.target.value
    setFieldValue('new_member.language', value)
  }

  const handleHowMeetUsChange = (event) => {
    let value = event.target.value
    setFieldValue('new_member.how_meet_us', value)
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
            <Box>
              <Typography sx={textHeader4}>{t('GENDER')}</Typography>
              <TextField
                sx={textField}
                select
                fullWidth
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    display: 'flex'
                  }
                }}
                onChange={handleChangeGender}
                value={values?.new_member.gender}>
                {Object.keys(gender_options).map((id) => (
                  <MenuItem key={id} value={id}>
                    {gender_options[id]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              name="birthdate"
              textFieldLabel={t('BIRTHDATE')}
              textFieldName={t('BIRTHDATE')}
              handleChange={handleChangeBirthdate}
              handleBlur={() => {
                setFieldTouched('new_member.birthdate', true)
              }}
              touched={touched?.new_member?.birthdate}
              value={values?.new_member.birthdate}
              error={errors?.new_member?.birthdate}
              required={false}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AddressField addressFieldName="address" {...props} />
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
            <Box>
              <Typography sx={textHeader4}>{t('HOW_MEET_US')}</Typography>
              <TextField
                sx={textField}
                select
                fullWidth
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    display: 'flex'
                  }
                }}
                onChange={handleHowMeetUsChange}
                value={values?.new_member.how_meet_us}>
                {Object.keys(how_meet_us_options).map((id) => (
                  <MenuItem key={id} value={id}>
                    {how_meet_us_options[id]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box>
              <Typography sx={textHeader4}>
                {t('GURB_LANGUAGE_FIELD')}
              </Typography>
              <TextField
                sx={textField}
                required
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

export default MemberPersonalData
