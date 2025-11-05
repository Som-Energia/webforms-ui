import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CheckBox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import ReviewField from '../../../../components/review/ReviewField'
import AlertBox from '../../../../components/AlertBox'
import TextRecomendation from '../../components/TextRecomendation'

import {
  textHeader4,
  participationAlertBoxTypography,
  participationAlertBoxIcon
} from '../../gurbTheme'
import { LightningIcon, EuroIcon } from '../../../../data/icons/Icons'

const CustomCheckBox = (props) => {
  const { name, onClick, text, checked, dataCy } = props

  return (
    <Box mt={2}>
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
    </Box>
  )
}

const ContractReview = (props) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = props

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <TextRecomendation title={t('CONTRACT_SUMMARY')} />
        </Grid>

        {/* KWH Section */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <LightningIcon />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('GURB_CONTRACT_SUMMARY_KWH')}
              </Typography>
              <ReviewField value={`${values.gurb.power} KWh`} />
            </Box>
          </Box>
        </Grid>

        {/* Join Cost Section */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <EuroIcon />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography sx={textHeader4}>
                {t('GURB_CONTRACT_SUMMARY_JOIN_COST')}
              </Typography>
              <ReviewField value={`${values?.gurb?.join_cost} €`} />
            </Box>
          </Box>
        </Grid>

        {/* Quota Section */}
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <EuroIcon />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
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
      </Box>

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
            specific_conditions_url: t('GURB_CHECK_SPEECIFIC_CONDITIONS_URL')
          })
        }}
        checked={values.generic_especific_conditons_accepted}
      />

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
            generic_conditions_url: t('GENERIC_CONDITIONS_URL')
          })
        }}
        checked={values.privacy_policy_accepted}
      />

      <CustomCheckBox
        name="tariff_payment_accepted"
        dataCy="tariff_payment_checkbox"
        onClick={() =>
          setFieldValue(
            'tariff_payment_accepted',
            !values.tariff_payment_accepted
          )
        }
        text={{ __html: t('GURB_CHECK_TARIFF_PAYMENNT_ACCEPTED') }}
        checked={values.tariff_payment_accepted}
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