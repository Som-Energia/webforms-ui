import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CheckBox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import ReviewField from '../../../../components/review/ReviewField'
import AlertBox from '../../../../components/AlertBox/AlertBox'
import TextRecommendation from '../../components/TextRecommendation/TextRecommendation'

import {
  textHeader4,
  participationAlertBoxTypography,
  participationAlertBoxIcon
} from '../../../../themes/gurbTheme'
import {
  LightningIcon,
  EuroIcon,
  PlaceMapIcon,
  SolarpanelIcon,
  CreditCardIcon,
  ReceiptIcon,
  PhoneIcon
} from '../../../../data/icons/Icons'

const CustomCheckBox = (props) => {
  const { name, onClick, text, checked, dataCy } = props

  return (
    <Grid mt={2}>
      <FormControlLabel
        sx={{ display: 'flex', gap: 2, color: 'black', fontWeight: 700 }}
        control={
          <CheckBox
            data-cy={dataCy}
            name={name}
            onChange={onClick}
            checked={checked}
          />
        }
        label={
          <Typography
            variant="body1"
            align="justify"
            dangerouslySetInnerHTML={text}></Typography>
        }
      />
    </Grid>
  )
}



const ContractReview = (props) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = props

  const formatGurbCost = () => {
    const value = values?.gurb?.join_cost
    return typeof value !== 'number' || Number.isNaN(value) ? Number.parseFloat(value)?.toFixed(2) : value.toFixed(2);
  }


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <TextRecommendation title={t('CONTRACT_SUMMARY')} isHeader={true} />
        </Grid>

        {/* KWH Section */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Grid sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <LightningIcon />
            <Grid sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('GURB_CONTRACT_SUMMARY_KWH')}
              </Typography>
              <ReviewField value={`${values.gurb.power} KWh`} />
            </Grid>
          </Grid>
        </Grid>

        {/* Join Cost Section */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Grid sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <EuroIcon />
            <Grid sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('GURB_CONTRACT_SUMMARY_JOIN_COST')}
              </Typography>
              <ReviewField
                value={t('GURB_CONTRACT_SUMMARY_JOIN_COST_DESCRIPTION', {
                  join_cost: formatGurbCost(values?.gurb?.join_cost)
                })}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Quota Section */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Grid sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <ReceiptIcon />
            <Grid sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('GURB_CONTRACT_SUMMARY_QUOTA')}
              </Typography>
              <ReviewField
                value={t('GURB_CONTRACT_SUMMARY_QUOTA_DESCRIPTION', {
                  power: values?.gurb?.power,
                  daily_cost: values?.gurb?.daily_cost,
                  monthly_cost: (values?.gurb?.daily_cost || 0) * 30
                })}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Gurb Type Section */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Grid sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <SolarpanelIcon />
            <Grid sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('GURB_CONTRACT_SUMMARY_GURB_TYPE')}
              </Typography>
              <ReviewField
                value={
                  values?.gurb?.surplus_compensation
                    ? t(
                      'GURB_CONTRACT_SUMMARY_GURB_TYPE_DESCRIPTION_WITH_SURPLUS_COMPENSATION'
                    )
                    : t(
                      'GURB_CONTRACT_SUMMARY_GURB_TYPE_DESCRIPTION_WITHOUT_SURPLUS_COMPENSATION'
                    )
                }
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Supplypoint Section*/}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Grid sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <PlaceMapIcon />
            <Grid sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('SUPPLYPOINT')}
              </Typography>
              <ReviewField
                value={t('GURB_CONTRACT_SUMMARY_SUPPLYPOINT_DESCRIPTION')}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Payment Section */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Grid sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <CreditCardIcon />
            <Grid sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('PAYMENT_TITLE')}
              </Typography>
              <ReviewField
                value={t('GURB_CONTRACT_SUMMARY_PAYMENT_DESCRIPTION')}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Grid sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <PhoneIcon />
            <Grid sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('CONTACT')}
              </Typography>
              <ReviewField
                value={t('GURB_CONTRACT_SUMMARY_CONTACT_DESCRIPTION')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12}>
          <AlertBox
            customTypographyStyle={participationAlertBoxTypography}
            customIconStyle={participationAlertBoxIcon}
            id="contract_review_info_alert"
            description={t('GURB_CONTRACT_REVIEW_INFO')}
            severity={'warning'}
            iconCustom={true}
            iconCustomSeverity="info"
            variant={'body2'}
          />
        </Grid>
        <Grid item xs={12} md={12} sx={{ mb: 2 }}>
          <Typography
            variant="body.sm.regular"
            dangerouslySetInnerHTML={{
              __html: t('GURB_PURPOSE').concat('<br />', t('RIGHTS'))
            }}
          />
        </Grid>
      </Grid>
      <CustomCheckBox
        name="privacy_policy_accepted"
        dataCy="privacy_policy_checkbox"
        onClick={() =>
          setFieldValue(
            'privacy_policy_accepted',
            !values.privacy_policy_accepted
          )
        }
        text={{
          __html: t('CONTRACT_PRIVACY_POLICY_TERMS', {
            url: t('CONTRACT_PRIVACY_POLICY_TERMS_URL')
          })
        }}
        checked={values.privacy_policy_accepted}
      />

      <CustomCheckBox
        name="generic_especific_conditons_accepted"
        dataCy="generic_especific_conditons_checkbox"
        onClick={() =>
          setFieldValue(
            'generic_especific_conditons_accepted',
            !values.generic_especific_conditons_accepted
          )
        }
        text={{
          __html: t('GURB_CHECK_GENERIC_AND_SPECIFIC_GURB_CONDITIONS', {
            generic_conditions_url: t('GENERIC_CONDITIONS_URL'),
            gurb_specific_conditions_url: t(
              'GURB_CHECK_SPECIFIC_CONDITIONS_URL'
            ),
            contract_specific_conditions_url: t(
              'CONTRACT_CHECK_SPECIFIC_CONDITIONS_URL'
            )
          })
        }}
        checked={values.generic_especific_conditons_accepted}
      />

      <CustomCheckBox
        name="gurb_adhesion_payment_accepted"
        dataCy="gurb_adhesion_payment_checkbox"
        onClick={() =>
          setFieldValue(
            'gurb_adhesion_payment_accepted',
            !values.gurb_adhesion_payment_accepted
          )
        }
        text={{ __html: t('GURB_CHECK_ADHESION_PAYMENT_ACCEPTED') }}
        checked={values.gurb_adhesion_payment_accepted}
      />
    </>
  )
}

export default ContractReview
