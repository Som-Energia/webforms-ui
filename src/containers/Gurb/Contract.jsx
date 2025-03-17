import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import SomGurbStepper, { GURB_CONTRACT_STEP } from './components/SomGurbStepper'

import Typography from '@mui/material/Typography'

import { textSubtitle } from './gurbTheme'

import GurbErrorContext from '../../context/GurbErrorContext'
import HolderIdentification from './pages/Contract/HolderIdentification'
import HolderPersonalData from './pages/Contract/HolderPersonalData'
import HolderVoluntaryDonation from './pages/Contract/VoluntaryDonation'
import HolderIban from './pages/Contract/Iban'
import TaxAddress from './pages/Contract/TaxAddress'
import SupplyPointData from './pages/Contract/SupplyPointData'
import Power from './pages/Contract/Power'
import TariffMode from './pages/Contract/TariffMode'
import ContractSummary from './pages/Contract/ContractSummary'
import TextRecomendation from './components/TextRecomendation'
import SomStepper from './components/SomStepper'
import Grid from '@mui/material/Grid'

export const CONTRACT_NUMBER_STEPS = 10

const Contract = (props) => {
  const CONTRACT_STEPS = 9
  const { values, activeStep } = props
  const { t } = useTranslation()
  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)

  const getTitle = () => {
    if (activeStep === 0) {
      return (
        <TextRecomendation
          title={t('GURB_HOLDER_ID_TITLE')}
          text={t('GURB_HOLDER_ID_SUBTITLE')}
        />
      )
    }
    if (activeStep === 1) {
      return (
        <TextRecomendation
          title={t('GURB_HOLDER_PERSONAL_DATA_TITLE')}
          text={t('GURB_HOLDER_ID_SUBTITLE')}
        />
      )
    }
    if (activeStep === 2) {
      return (
        <TextRecomendation
          title={t('GURB_HOLDER_SUPPLYPOINT_TITLE')}
          text={t('GURB_HOLDER_ID_SUBTITLE')}
        />
      )
    }
    if (activeStep === 3) {
      return (
        <TextRecomendation
          title={t('GURB_SUPPLY_POINT_DATA_TITLE')}
          text={t('GURB_SUPPLY_POINT_DATA_SUBTITLE')}
        />
      )
    }
    if (activeStep === 4) {
      return <TextRecomendation title={t('GURB_POWER_TITLE')} />
    }
    if (activeStep === 5) {
      return <TextRecomendation title={t('GURB_TARIFFMODE_TITLE')} />
    }
    if (activeStep === 6) {
      return (
        <TextRecomendation title={t('GURB_HOLDER_VOLUNTARY_DONATION_TITLE')} />
      )
    }
    if (activeStep === 7) {
      return <TextRecomendation title={t('GURB_IBAN_TITLE')} />
    }
    if (activeStep === 8) {
      return <TextRecomendation title={t('GURB_CONTRACT_SUMMARY_TITLE')} />
    } else {
      return <></>
    }
  }

  const getStep = () => {
    if (activeStep === 0) {
      return <HolderIdentification {...props} />
    }
    if (activeStep === 1) {
      return <HolderPersonalData {...props} />
    }
    if (activeStep === 2) {
      return <TaxAddress {...props} />
    }
    if (activeStep === 3) {
      return <SupplyPointData {...props} />
    }
    if (activeStep === 4) {
      return <Power {...props} />
    }
    if (activeStep === 5) {
      return <TariffMode {...props} />
    }
    if (activeStep === 6) {
      return <HolderVoluntaryDonation {...props} />
    }
    if (activeStep === 7) {
      return <HolderIban {...props} />
    }
    if (activeStep === 8) {
      return <ContractSummary {...props} />
    } else {
      return <></>
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <SomGurbStepper activeStep={GURB_CONTRACT_STEP} />
      </Grid>
      <Grid item xs={12}>
        {getTitle()}
      </Grid>
      <Grid item xs={12}>
        <SomStepper step={activeStep} connectors={CONTRACT_STEPS} />
      </Grid>
      <Grid item xs={12}>
        {error ? getStepResult(errorInfo) : getStep()}
      </Grid>
    </Grid>
  )
}

export default Contract
