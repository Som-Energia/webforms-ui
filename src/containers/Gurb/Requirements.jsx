import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SomStepper from './components/SomStepper'
import TextRecomendation from './components/TextRecomendation'
import Chooser from './components/Chooser'
import InputField from './components/InputField'
import { HelperText } from './components/InputField'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined'
import Grid from '@mui/material/Grid'

const iconRequirements = {
  marginBottom: '1rem',
  borderRadius: '8px',
  border: '1px solid #D9D9D9',
  color: '#1E1E1E',
  fontSize: '3rem',
  padding: '8px'
}

const LightQuestion = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <TextRecomendation title={t('GURB_ACTUALMENT_HI_HA_LLUM')} />
      &nbsp;
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Chooser
            icon={<LightbulbOutlinedIcon sx={iconRequirements} />}
            textHeader={t('GURB_HI_HA_LLUM')}
            textBody={t('GURB_HI_HA_LLUM_BODY')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Chooser
            icon={<LightbulbOutlinedIcon sx={iconRequirements} />}
            textHeader={t('GURB_NO_HI_HA_LLUM')}
            textBody={t('GURB_NO_HI_HA_LLUM_BODY')}
          />
        </Grid>
      </Grid>
    </>
  )
}
const Address = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <TextRecomendation
        title={t('GURB_ADRECA_SUBMINISTRAMENT_TITLE')}
        text={t('GURB_ADRECA_SUBMINISTRAMENT_TITLE_HELPER')}
      />
      &nbsp;
      <InputField
        textFieldName={t('GURB_ADRECA_SUBMINISTRAMENT')}
        textFieldHelper={t('GURB_ADRECA_SUBMINISTRAMENT_HELPER')}
        iconHelper={false}
      />
    </>
  )
}
const SelfConsumption = (props) => {
  const { t } = useTranslation()

  return (
    <>
      {' '}
      <TextRecomendation title={t('GURB_AUTOCONSUM_TITLE')} />
      &nbsp;
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Chooser
            icon={<SolarPowerOutlinedIcon sx={iconRequirements} />}
            textHeader={t('GURB_TINC_AUTOCONSUM')}
            textBody={t('GURB_TINC_AUTOCONSUM_BODY')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Chooser
            icon={<SolarPowerOutlinedIcon sx={iconRequirements} />}
            textHeader={t('GURB_NO_TINC_AUTOCONSUM')}
            textBody={t('GURB_NO_TINC_AUTOCONSUM_BODY')}
          />
        </Grid>
      </Grid>
      &nbsp;
      <HelperText helperText={t('GURB_AUTOCONSUM_HELPER')} iconHelper={true} />
    </>
  )
}
const MemberQuestion = () => {
  return <>Member</>
}

const Requirements = (props) => {
  const { activeStep } = props
  const { t } = useTranslation()

  const getStep = () => {
    if (activeStep === 0) {
      return <LightQuestion {...props} />
    } else if (activeStep === 1) {
      return <Address {...props} />
    } else if (activeStep === 2) {
      return <SelfConsumption {...props} />
    } else {
      return <MemberQuestion {...props} />
    }
  }

  return (
    <>
      <SomStepper step={activeStep} connectors={4 + 1} />
      {getStep()}
    </>
  )
}
export default Requirements
