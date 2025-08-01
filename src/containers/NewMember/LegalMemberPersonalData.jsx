import { useTranslation } from 'react-i18next'
import { useRef, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import ArticleIcon from '@mui/icons-material/Article'
import { iconRequirements } from '../../themes/commonStyles'
import { iconOffRequirements } from '../../themes/commonStyles'

import InputField from '../../components/InputField'
import AddressField from '../../components/AddressField'
import SelectField from '../../components/SelectField'
import PhoneField from '../../components/PhoneField'
import Chooser from '../../components/NewChooser'

import { useHandleChange } from '../../hooks/useHandleChange'
import { useHandleBlur } from '../../hooks/useHandleBlur'

const languages = {
  es_ES: 'Español',
  ca_ES: 'Català'
}

const LegalMemberPersonalData = (props) => {
  const {
    title = true,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = props
  const { i18n, t } = useTranslation()

  const didSetInitialLanguage = useRef(false)

  useEffect(() => {
    if (!didSetInitialLanguage.current) {
      const newLanguage = `${i18n.language}_ES`
      setFieldValue('new_member.language', newLanguage)
      didSetInitialLanguage.current = true
    }
  }, [i18n.language, setFieldValue])

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

  const handleChange = useHandleChange(setFieldValue)
  const handleBlur = useHandleBlur(setFieldTouched)

  const handleCheckboxLegalPerson = (event) => {
    let value = event.target.checked
    setFieldValue('new_member.legal_person_accepted', value)
    setFieldTouched('new_member.legal_person_accepted', true)
  }

  const handleHolderAddressQuestion = (value) => {
    setFieldValue('new_member.has_different_address', value)
    if (value === 'supplypoint-tax-address-same'){
      for (var key in values.supply_point_address){
        setFieldValue('address.'+ key, values.supply_point_address[key])
      }
    } else {
      if (
        values.address.street === values.supply_point_address.street &&
        values.address.number === values.supply_point_address.number &&
        values.address.floor === values.supply_point_address.floor &&
        values.address.door === values.supply_point_address.door &&
        values.address.stairs === values.supply_point_address.stairs &&
        values.address.bloc === values.supply_point_address.bloc
        )
      {
        for (var key in values.address){
          setFieldValue('address.'+ key, '')
        }
      }
    }
  }

  const options = [
    {
      id: 'supplypoint-tax-address-same',
      icon: <ArticleIcon sx={iconRequirements} />,
      textHeader: t('GURB_SAME_SUPPLYPOINT_TAX_ADDRESS_HEADER'),
      textBody: t('GURB_SAME_SUPPLYPOINT_TAX_ADDRESS_BODY')
    },
    {
      id: 'supplypoint-tax-address-different',
      icon: <ArticleIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_DIFFERENT_SUPPLYPOINT_TAX_ADDRESS_HEADER'),
      textBody: t('GURB_DIFFERENT_SUPPLYPOINT_TAX_ADDRESS_BODY')
    }
  ]

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
        <Typography  variant="body.md.medium">
          {t('GURB_HOLDER_ADDRESS_QUESTION_HELPER')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="sameDirection"
          options={options}
          value={values.new_member.has_different_address}
          handleChange={handleHolderAddressQuestion}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <InputField
              name={'new_member.name'}
              textFieldName={t('BUSINESS_NAME')}
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
              name={'new_member.proxyname'}
              textFieldName={t('PROXY_NAME')}
              handleChange={handleChange}
              handleBlur={handleBlur}
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
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched?.new_member?.proxynif}
              value={values?.new_member.proxynif}
              error={errors?.new_member?.proxynif}
              required={true}
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
