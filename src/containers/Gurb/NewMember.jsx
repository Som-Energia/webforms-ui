import { useTranslation } from 'react-i18next'

import useTheme from '@mui/material/styles/useTheme'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import { textSubtitle } from './gurbTheme'

import MemberDetails from './pages/NewMember/MemberDetails'
import ApadrinatingDetails from './pages/NewMember/ApadrinatingDetails'
import NewMemberDetails from './pages/NewMember/NewMemberDetails'
import SomGurbStepper from './components/SomGurbStepper'

const NewMember = (props) => {
  const { values, activeStep, stepperSteps, stepperActiveSteps } = props
  const { t } = useTranslation()
  const theme = useTheme()

  const getMemberPage = () => {
    if (activeStep === 0) {
      return <MemberDetails {...props} />
    } else if (activeStep === 1) {
      return <NewMemberDetails {...props} />
    } else {
      return <ApadrinatingDetails {...props} />
    }
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography sx={theme.webFormStyles.textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <SomGurbStepper
          steps={stepperSteps}
          activeStep={stepperActiveSteps}
        />
      </Grid>
      <Grid item xs={12}>
        {getMemberPage()}
      </Grid>
    </Grid>
  )
}

export default NewMember
