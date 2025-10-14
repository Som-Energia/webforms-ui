import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader4, textHeader2 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import ReviewField from '../../../../components/review/ReviewField'
import FormControlLabel from '@mui/material/FormControlLabel'
import CheckBox from '@mui/material/Checkbox'
import Alert from '@mui/material/Alert'

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
      <Typography sx={{ ...textHeader2, mb: 8 }}>{t('CONTRACT_SUMMARY')}</Typography>

      <Grid container>
        <Grid container item xs={6} sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <LightningIcon />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={textHeader4}>{t("GURB_CONTRACT_SUMMARY_KWH")}</Typography>
            <ReviewField value={`${values.gurb.power} KWh`} />
          </Box>
        </Grid>
        <Grid container xs={6} sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <EuroIcon />
          <Grid xs={6}>
            <Typography sx={textHeader4}>{t("GURB_CONTRACT_SUMMARY_JOIN_COST")}</Typography>
            <ReviewField value={`${values?.gurb?.join_cost} €`} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <EuroIcon />
        <Grid xs={6}>
          <Typography sx={textHeader4}>{t("GURB_CONTRACT_SUMMARY_QUOTA")}</Typography>
          <ReviewField value={t('GURB_CONTRACT_SUMMARY_QUOTA_DESCRIPTION', {
            power: values?.gurb?.power,
            daily_cost: values?.gurb?.daily_cost * values?.gurb?.power,
            monthly_cost: (values?.gurb?.daily_cost || 0) * 30
          })
          } />
        </Grid>
      </Grid >

      <Alert severity="warning" sx={{ mt: 4, mb: 4 }}>
        <Typography>{t('GURB_CONTRACT_REVIEW_INFO')}</Typography>
      </Alert>

      <CustomCheckBox name="generic_especific_conditons_accepted"
        dataCy="generic_especific_conditons_checkbox"
        onClick={() => setFieldValue("generic_especific_conditons_accepted", !values.generic_especific_conditons_accepted)} text={{
          __html: t('GURB_CHECK_GENERIC_AND_SPECIFIC_GURB_CONDITIONS', {
            generic_conditions_url: t('GENERIC_CONDITIONS_URL'),
            specific_conditions_url: t('GURB_CHECK_SPEECIFIC_CONDITIONS_URL')
          })
        }} checked={values.generic_especific_conditons_accepted} />

      <CustomCheckBox name="privacy_policy_accepted"
        dataCy="privacy_policy_checkbox"
        onClick={() => setFieldValue("privacy_policy_accepted", !values.privacy_policy_accepted)} text={{
          __html: t('CONTRACT_PRIVACY_POLICY_TERMS', {
            generic_conditions_url: t('GENERIC_CONDITIONS_URL')
          })
        }} checked={values.privacy_policy_accepted} />

      <CustomCheckBox name="tariff_payment_accepted"
        dataCy="tariff_payment_checkbox"
        onClick={() => setFieldValue("tariff_payment_accepted", !values.tariff_payment_accepted)}
        text={{ __html: t("GURB_CHECK_TARIFF_PAYMENNT_ACCEPTED") }}
        checked={values.tariff_payment_accepted}
      />
      <CustomCheckBox name="gurb_adhesion_payment_accepted"
        dataCy="gurb_adhesion_payment_checkbox"
        onClick={() => setFieldValue("gurb_adhesion_payment_accepted", !values.gurb_adhesion_payment_accepted)}
        text={{ __html: t("GURB_CHECK_ADHESION_PAYMENT_ACCEPTED") }}
        checked={values.gurb_adhesion_payment_accepted}
      />

    </>
  )
}

export default ContractReview
