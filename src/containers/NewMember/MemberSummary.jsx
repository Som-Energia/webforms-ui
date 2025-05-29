import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import ReviewTable from '../../components/review/ReviewTable'
import InputTitle from '../../components/InputTitle'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import PersonIcon from '@mui/icons-material/Person'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'

import { iconRequirements } from '../../themes/commonStyles'
import { NEW_MEMBER_FORM_SUBSTEPS } from '../../services/steps'

import Loading from '../../components/Loading'

const MemberSummary = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched
  } = props

  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)

  const handleChangePrivacyPolicy = (event) => {
    const checked = event.target.checked
    setFieldValue('privacy_policy_accepted', checked)
    setFieldTouched('privacy_policy_accepted', true)
  }

  const handleChangeStatutes = (event) => {
    const checked = event.target.checked
    setFieldValue('statutes_accepted', checked)
    setFieldTouched('statutes_accepted', true)
  }

  const languages = {
    es_ES: 'Español',
    ca_ES: 'Català',
    eu_ES: 'Euskera',
    gl_ES: 'Galego'
  }

  const legalReviewFields = {
    icon: <PersonIcon sx={iconRequirements} />,
    title: t('REVIEW_HOLDER_TITLE'),
    field: [
      {
        reviewLabel: t('BUSINESS_NAME'),
        reviewValue: values?.new_member?.name,
        step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
      },
      {
        reviewLabel: t('CIF'),
        reviewValue: values?.new_member?.nif,
        step: NEW_MEMBER_FORM_SUBSTEPS['IDENTIFY_MEMBER']
      },
      {
        reviewLabel: t('PROXY'),
        reviewValue: `${values?.new_member?.proxyname} (${values?.new_member?.proxynif})`,
        step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
        reviewValue: `${values?.address?.street} ${values?.address?.number}`,
        step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_CITY'),
        reviewValue: values?.address?.city?.name,
        step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
      }
    ]
  }

  const physicalReviewFields = {
    icon: <PersonIcon sx={iconRequirements} />,
    title: t('REVIEW_HOLDER_TITLE'),
    field: [
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_NAME'),
        reviewValue: `${values?.new_member?.name} ${values?.new_member?.surname1} ${values?.new_member?.surname2}`,
        step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
      },
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_NIF'),
        reviewValue: values?.new_member?.nif,
        step: NEW_MEMBER_FORM_SUBSTEPS['IDENTIFY_MEMBER']
      },
      {
        reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
        reviewValue: `${values?.address?.street} ${values?.address?.number}`,
        step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_CITY'),
        reviewValue: values?.address?.city?.name,
        step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
      }
    ]
  }

  const reviewFields = [
    [
      values?.new_member?.person_type == 'physic-person'
        ? physicalReviewFields
        : legalReviewFields,
      {
        icon: <LocalPhoneOutlinedIcon sx={iconRequirements} />,
        title: t('REVIEW_CONTACT_INFORMATION_TITLE'),
        field: [
          {
            reviewLabel: t('REVIEW_HOLDER_LABEL_PHONE'),
            reviewValue: `(${values?.new_member?.phone_code}) ${values?.new_member?.phone}`,
            step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          },
          {
            reviewLabel: t('REVIEW_HOLDER_LABEL_EMAIL'),
            reviewValue: values?.new_member?.email,
            step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          },
          {
            reviewLabel: t('LANGUAGE'),
            reviewValue: languages[values?.new_member?.language],
            step: NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          }
        ]
      }
    ],
    [
      {
        icon: <CreditCardOutlinedIcon sx={iconRequirements} />,
        title: t('REVIEW_PAYMENT_DATA_TITLE'),
        field: [
          {
            reviewLabel: t('PAYMENT_METHOD'),
            reviewValue: values?.new_member?.payment_method,
            step: NEW_MEMBER_FORM_SUBSTEPS['PAYMENT_INFO']
          },
          {
            reviewLabel: t('REVIEW_PAYMENT_DATA_LABEL_IBAN'),
            reviewValue: values?.new_member?.iban,
            step: NEW_MEMBER_FORM_SUBSTEPS['PAYMENT_INFO'],
            hide: values?.new_member?.payment_method != 'iban'
          }
        ]
      }
    ]
  ]

  const handleCheckboxChange = async (event, fieldName) => {
    let value = event.target.checked
    await setFieldValue(fieldName, value)
    setFieldTouched(fieldName, true)
  }

  return loading ? (
    <Loading />
  ) : (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">{t('MEMBER_PAGE_SUMMARY')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle text={t('MEMBER_PAGE_SUMMARY_QUESTION')} />
      </Grid>
      <Grid item xs={12}>
        <ReviewTable tableFields={reviewFields} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.sm.regular" color="secondary.dark">
          {t('PURPOSE_MEMBER')}
          <br />
          {t('RIGHTS_MEMBER')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="privacy_policy"
              checked={values?.privacy_policy_accepted || false}
              onChange={handleChangePrivacyPolicy}
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

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="statutes"
              checked={values?.statutes_accepted || false}
              onChange={handleChangeStatutes}
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('ACCEPT_STATUTES', {
                  url: t('ACCEPT_STATUTES_URL')
                })
              }}
            />
          }
        />
      </Grid>

      {values?.new_member?.person_type === 'legal-person' && (
        <>
          <Grid item xs={12}>
            <Typography variant="headline4">
              {t('SOM_SERVEIS_INFO_TITLE')}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  data-cy="comercial_info_accepted"
                  checked={values?.comercial_info_accepted}
                  onChange={(event) => {
                    handleCheckboxChange(
                      event,
                      'comercial_info_accepted'
                    )
                  }}
                />
              }
              label={
                <label
                  dangerouslySetInnerHTML={{
                    __html: t('SOM_SERVEIS_INF0_ACCEPTED')
                  }}
                />
              }
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default MemberSummary
