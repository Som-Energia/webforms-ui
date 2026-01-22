import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import ReviewTable from '../../../components/review/ReviewTable'
import InputTitle from '../../../components/InputTitle'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import { buttonLight } from '../../../components/Buttons/buttonStyles'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import { iconRequirements } from '../../../themes/commonStyles'
import { NEW_MEMBER_FORM_SUBSTEPS } from '../../../services/steps'
import { PersonalIcon, PhoneIcon, CreditCardIcon } from '../../../data/icons/Icons'

import Loading from '../../../components/Loading'

const MemberSummary = (props) => {
  const {
    values,
    setFieldValue,
    setFieldTouched
  } = props

  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [showReviewLinks, setShowReviewLinks] = useState(false)

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
    icon: <PersonalIcon sx={iconRequirements} />,
    title: t('REVIEW_HOLDER_TITLE'),
    field: [
      {
        reviewLabel: t('BUSINESS_NAME'),
        reviewValue: values?.new_member?.name,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('CIF'),
        reviewValue: values?.new_member?.nif,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['IDENTIFY_MEMBER']
          : null
      },
      {
        reviewLabel: t('PROXY'),
        reviewValue: `${values?.new_member?.proxyname} (${values?.new_member?.proxynif})`,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
        reviewValue: `${values?.address?.street} ${values?.address?.number}`,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_CITY'),
        reviewValue: values?.address?.city?.name,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          : null
      }
    ]
  }

  const physicalReviewFields = {
    icon: <PersonalIcon sx={iconRequirements} />,
    title: t('REVIEW_HOLDER_TITLE'),
    field: [
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_NAME'),
        reviewValue: `${values?.new_member?.name} ${values?.new_member?.surname1} ${values?.new_member?.surname2}`,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_NIF'),
        reviewValue: values?.new_member?.nif,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['IDENTIFY_MEMBER']
          : null
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
        reviewValue: `${values?.address?.street} ${values?.address?.number}`,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_CITY'),
        reviewValue: values?.address?.city?.name,
        step: showReviewLinks
          ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
          : null
      }
    ]
  }

  const reviewFields = [
    [
      values?.new_member?.person_type == 'physic-person'
        ? physicalReviewFields
        : legalReviewFields,
      {
        icon: <PhoneIcon sx={iconRequirements} />,
        title: t('REVIEW_CONTACT_INFORMATION_TITLE'),
        field: [
          {
            reviewLabel: t('REVIEW_HOLDER_LABEL_PHONE'),
            reviewValue: `(${values?.new_member?.phone_code}) ${values?.new_member?.phone}`,
            step: showReviewLinks
              ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
              : null
          },
          {
            reviewLabel: t('REVIEW_HOLDER_LABEL_EMAIL'),
            reviewValue: values?.new_member?.email,
            step: showReviewLinks
              ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
              : null
          },
          {
            reviewLabel: t('LANGUAGE'),
            reviewValue: languages[values?.new_member?.language],
            step: showReviewLinks
              ? NEW_MEMBER_FORM_SUBSTEPS['MEMBER_INFO']
              : null
          }
        ]
      }
    ],
    [
      {
        icon: <CreditCardIcon sx={iconRequirements} />,
        title: t('REVIEW_PAYMENT_DATA_TITLE'),
        field: [
          {
            reviewLabel: t('PAYMENT_METHOD'),
            reviewValue: values?.new_member?.payment_method,
            step: showReviewLinks
              ? NEW_MEMBER_FORM_SUBSTEPS['PAYMENT_INFO']
              : null
          },
          {
            reviewLabel: t('REVIEW_PAYMENT_DATA_LABEL_IBAN'),
            reviewValue: values?.new_member?.iban,
            step: showReviewLinks
              ? NEW_MEMBER_FORM_SUBSTEPS['PAYMENT_INFO']
              : null,
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
        <Typography variant="headline4.regular">{t('MEMBER_PAGE_SUMMARY')}</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <InputTitle text={t('MEMBER_PAGE_SUMMARY_QUESTION')} />
        {!showReviewLinks && (
          <Button
            id="edit_button"
            size="small"
            sx={{
              ...buttonLight,
              minWidth: 'auto',
              width: 'auto',
              fontSize: '0.90rem',
              textTransform: 'none'
            }}
            startIcon={<EditOutlinedIcon fontSize="medium" />}
            onClick={() => setShowReviewLinks(true)}>
            {t('EDIT_DATA')}
          </Button>
        )}
      </Grid>
      <Grid item xs={12}>
        <ReviewTable tableFields={reviewFields} />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="body.sm.regular"
          color="secondary.extraDark"
          dangerouslySetInnerHTML={{
            __html: t('PURPOSE_MEMBER').concat('<br />' ,t('RIGHTS_MEMBER'))
          }}
        />
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
