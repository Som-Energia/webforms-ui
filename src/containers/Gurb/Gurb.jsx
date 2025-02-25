import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import SomGurbStepper, { GURB_FINAL_STEP } from './components/SomGurbStepper'
import Header from './components/Header'

import Typography from '@mui/material/Typography'
import { textSubtitle } from './gurbTheme'
import GurbErrorContext from '../../context/GurbErrorContext'
import GurbParticipation from './pages/Gurb/GurbParticipation'



const Contract = (props) => {
    const { activeStep } = props
    const { t } = useTranslation()
    const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)

    const getStep = () => {
        if (activeStep === 0) {
            return <GurbParticipation {...props} />
        }
        else {
            return <></>
        }
    }

    return (
        <>
            <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
            <SomGurbStepper activeStep={GURB_FINAL_STEP} />
            <Header title={t('GURB_REQUIREMENTS_TITLE')} />
            {error ? getStepResult(errorInfo) : getStep()}
        </>
    )
}

export default Contract
