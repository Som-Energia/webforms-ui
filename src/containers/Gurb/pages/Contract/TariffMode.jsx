import React from 'react'
import { useTranslation } from 'react-i18next'

import BoltIcon from '@mui/icons-material/Bolt'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Chooser from '../../components/Chooser'
import { HelperText } from '../../components/InputField'
import RequiredTitle from '../../components/InputTitle'
import SomStepper from '../../components/SomStepper'
import TextRecomendation from '../../components/TextRecomendation'

import { iconRequirements, textHeader4, textHeader5 } from '../../gurbTheme'


const TariffMode = (props) => {
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

  const handleChange = async (value) => {
    setFieldValue('contract.tariff_mode', value)
  }

  const options = [
    {
      id: 'periods',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_TARIFFMODE_PERIODS_HEADER'),
      textBody: t('GURB_TARIFFMODE_PERIODS_BODY')
    },
    {
      id: 'indexed',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_TARIFFMODE_INDEXED_HEADER'),
      textBody: t('GURB_TARIFFMODE_INDEXED_BODY')
    }
  ]

  return (
    <>
      {console.log(values, errors)}
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation title={t('GURB_TARIFFMODE_TITLE')} />
        <SomStepper step={activeStep} connectors={7 + 1} />  {/*TODO*/}
      </Box>
      <Box marginTop={'3rem'} marginBottom={'4rem'}>
        <RequiredTitle
          text={t('GURB_TARIFFMODE_QUESTION')}
          textStyle={textHeader4}
          required={true}
        />
        <Chooser
          name='tariffMode'
          options={options}
          value={values.contract.tariff_mode}
          handleChange={handleChange}
        />
      </Box>
      <HelperText
        justifyContent='center'
        helperText={'TODO: Edit HelperText with links'}
      />
    </>
  )
}

export default TariffMode

