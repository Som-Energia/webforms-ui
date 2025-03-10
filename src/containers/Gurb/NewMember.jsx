import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import SomGurbStepper, {
  GURB_NEW_MEMBER_STEP
} from './components/SomGurbStepper'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import { textSubtitle } from './gurbTheme'
import MemberDetails from './pages/NewMember/MemberDetails'
import ApadrinatingDetails from './pages/NewMember/ApadrinatingDetails'
import NewMemberDetails from './pages/NewMember/NewMemberDetails'

const NewMember = (props) => {
  const { values, activeStep } = props
  const { t } = useTranslation()

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
        <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <SomGurbStepper activeStep={GURB_NEW_MEMBER_STEP} />
      </Grid>
      <Grid item xs={12}>{getMemberPage()}</Grid>
    </Grid>
  )
}

export default NewMember
