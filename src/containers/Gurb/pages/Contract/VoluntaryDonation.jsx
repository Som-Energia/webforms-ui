import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../components/Chooser'
import SomStepper from '../../components/SomStepper'
import RequiredTitle from '../../components/RequiredTitle'
import { HelperText } from '../../components/InputField'

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

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
    <>
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation title={t('GURB_HOLDER_VOLUNTARY_DONATION_TITLE')} />
        <SomStepper step={activeStep} connectors={7 + 1} />
        <Typography
          sx={{ ...textBody1, marginBottom: '1rem' }}
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t('GURB_VOLUNTARY_DONATION_HOW_INFO')
          }}
        />
        <Typography
          sx={textBody1}
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t('GURB_VOLUNTARY_DONATION_WHY_INFO')
          }}
        />
      </Box>
      <Box marginTop={'4rem'} marginBottom={'4rem'}>
        <RequiredTitle
          text={t('GURB_VOLUNTARY_DONATION_QUESTION')}
          textStyle={textHeader4}
          required={true}
        />
        <Chooser
          options={options}
          value={values.holder.voluntary_donation}
          handleChange={handleVoluntaryDonationQuestion}
        />
        <HelperText
          helperText={t('GURB_VOLUNTARY_DONATION_HELPER')}
          iconHelper={false}
          justifyContent={'center'}
        />
      </Box>
    </>
  )
}
export default HolderVoluntaryDonation
