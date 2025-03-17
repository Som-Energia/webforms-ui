import { useTranslation } from 'react-i18next'

import Chooser from '../../components/Chooser'
import RequiredTitle from '../../components/InputTitle'
import { HelperText } from '../../components/InputField'

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import {
  iconOffRequirements,
  iconRequirements,
  textBody1,
  textHeader4
} from '../../gurbTheme'

const HolderVoluntaryDonation = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched
  } = props

  const { t } = useTranslation()

  const handleVoluntaryDonationQuestion = (value) => {
    setFieldValue('holder.voluntary_donation', value)
  }

  const options = [
    {
      id: 'voluntary-donation-on',
      icon: <FavoriteBorderIcon sx={iconRequirements} />,
      textHeader: t('GURB_VOLUNTARY_DONATION_ON_HEADER')
    },
    {
      id: 'voluntary-donation-off',
      icon: <FavoriteBorderIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_VOLUNTARY_DONATION_OFF_HEADER')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          sx={textBody1}
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t('GURB_VOLUNTARY_DONATION_HOW_INFO')
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={{ ...textBody1, marginBottom: '1rem' }}
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t('GURB_VOLUNTARY_DONATION_WHY_INFO')
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <RequiredTitle
          text={t('GURB_VOLUNTARY_DONATION_QUESTION')}
          textStyle={textHeader4}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="donation_question"
          options={options}
          value={values.holder.voluntary_donation}
          handleChange={handleVoluntaryDonationQuestion}
        />
      </Grid>
      <Grid item xs={12}>
        <HelperText
          helperText={t('GURB_VOLUNTARY_DONATION_HELPER')}
          iconHelper={false}
          justifyContent={'center'}
        />
      </Grid>
    </Grid>
  )
}
export default HolderVoluntaryDonation
