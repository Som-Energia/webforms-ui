import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader4 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ReviewField from '../../components/review/ReviewField'
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import CheckBox from '@mui/material/Checkbox'

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
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: "100%", marginBottom: "30px" }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <DescriptionOutlinedIcon />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={textHeader4}>{"Participació en KWh"}</Typography>
            <ReviewField label={"KWh:"} value={values.contract.gurb_power} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <PersonIcon />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={textHeader4}>{"Beta en percentatge"}</Typography>
            <ReviewField label={"KWh:"} value={"0.5KWh"} />
          </Box>
        </Box>
      </Box>
      <Divider />

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
