import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import SomGurbStepper, {
  GURB_NEW_MEMBER_STEP
} from './components/SomGurbStepper'

import Typography from '@mui/material/Typography'

import { textSubtitle } from './gurbTheme'
import MemberDetails from './pages/NewMember/MemberDetails'
import ApadrinatingDetails from './pages/NewMember/ApadrinatingDetails'
import NewMemberDetails from './pages/NewMember/NewMemberDetails'

import GurbErrorContext from '../../context/GurbErrorContext'

const NewMember = (props) => {
  const { values } = props
  const { t } = useTranslation()
  const { error, errorInfo, getStepResult } = useContext(GurbErrorContext)

  const getMemberPage = () => {
    if (values.has_member === 'member-on') {
      return <MemberDetails {...props} />
    } else if (values.has_member === 'member-off') {
      return <NewMemberDetails {...props} />
    } else {
      return <ApadrinatingDetails {...props} />
    }
  }
  return (
    <>
      <Typography sx={textSubtitle}>{t('GURB_FORM_TITLE')}</Typography>
      <SomGurbStepper activeStep={GURB_NEW_MEMBER_STEP} />
      {error ? getStepResult(errorInfo) : getMemberPage()}
    </>
  )
}

export default NewMember
