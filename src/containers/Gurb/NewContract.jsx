import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import SomGurbStepper, {
  GURB_CONTRACT_STEP
} from './components/SomGurbStepper'

import Typography from '@mui/material/Typography'

import { textSubtitle } from './gurbTheme'

import GurbErrorContext from '../../context/GurbErrorContext'

const NewContract = (props) => {
  const { values } = props
  const { t } = useTranslation()
  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)

  return (
    <>
      <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      <SomGurbStepper activeStep={GURB_CONTRACT_STEP} />
      {error ? getStepResult(errorInfo) : <>{'NEW CONTRACT PAGES'}</> }
    </>
  )
}

export default NewContract
