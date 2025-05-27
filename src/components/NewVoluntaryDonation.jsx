import { useTranslation } from 'react-i18next'

import Chooser from './NewChooser'
import RequiredTitle from './InputTitle'

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import { iconRequirements } from '../themes/commonStyles'
import {
  iconOffRequirements
} from '../themes/webforms/'

const HolderVoluntaryDonation = (props) => {
  const { values, setFieldValue } = props

  const { t } = useTranslation()

  const handleVoluntaryDonationQuestion = (value) => {
    setFieldValue('voluntary_donation', value)
  }

  const options = [
    {
      id: true,
      icon: <FavoriteBorderIcon sx={iconRequirements} />,
      textHeader: t('VOLUNTARY_DONATION_ON_HEADER')
    },
    {
      id: false,
      icon: <FavoriteBorderIcon sx={iconOffRequirements} />,
      textHeader: t('VOLUNTARY_DONATION_OFF_HEADER')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          sx={'body.sm.regular'}
          color='background.main.dark'
          dangerouslySetInnerHTML={{
            __html: t('VOLUNTARY_DONATION_HOW_INFO')
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={'body.sm.regular'}
          color='background.main.dark'
          dangerouslySetInnerHTML={{
            __html: t('VOLUNTARY_DONATION_WHY_INFO')
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <RequiredTitle
          text={t('VOLUNTARY_DONATION_QUESTION')}
          textStyle={'body.sm.regular'}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="donation_question"
          options={options}
          value={values.voluntary_donation}
          handleChange={handleVoluntaryDonationQuestion}
        />
      </Grid>
    </Grid>
  )
}
export default HolderVoluntaryDonation
