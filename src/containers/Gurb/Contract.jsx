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

const Contract = (props) => {
  const { values, activeStep } = props
  const { t } = useTranslation()
  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)

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
    <>
      <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      <SomGurbStepper activeStep={GURB_CONTRACT_STEP} />

      {error ? getStepResult(errorInfo) : getStep()}
    </>
  )
}

export default Contract
