import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import InputField, { HelperText } from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../components/Chooser'
import PowerInputs from '../../components/PowerInputs'
import SomStepper from '../../components/SomStepper'

import BoltIcon from '@mui/icons-material/Bolt'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import GurbLoadingContext from '../../../../context/GurbLoadingContext'

import {
  iconOffRequirements,
  iconRequirements,
  textHeader4,
  textHeader5
} from '../../gurbTheme'

const Power = (props) => {
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
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handlePowerQuestion = (value) => {
    setFieldValue('contract.power_type', value)
  }

  const options = [
    {
      id: 'power-lower-15kw',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_POWER_LOWER_15_HEADER')
    },
    {
      id: 'power-higher-15kw',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_POWER_HIGHER_15_HEADER')
    }
  ]

  console.log('VALUES', values)
  console.log('ERRRR', errors)

  return (
    <>
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation title={t('GURB_POWER_TITLE')} />
        <SomStepper step={activeStep} connectors={7 + 1} />
      </Box>
      <Box marginTop={'3rem'} marginBottom={'4rem'}>
        <Typography sx={textHeader4}>{t('GURB_POWER_QUESTION')}</Typography>
        <Typography sx={textHeader5}>{t('GURB_POWER_HELPER')}</Typography>
        <Chooser
          options={options}
          value={values.contract.power_type}
          handleChange={handlePowerQuestion}
        />
      </Box>
      {values.contract.power_type === 'power-lower-15kw' && (
        <>
          <PowerInputs
            namePrefix="contract"
            numInputs={2}
            {...props}
            values={values?.contract}
            errors={errors?.contract}
            touched={touched?.contract}
          />
          <HelperText
            helperText={t('GURB_POWER_LOWER_15_HELPER')}
            iconHelper={true}
          />
        </>
      )}
      {values.contract.power_type === 'power-higher-15kw' && (
        <>
          <PowerInputs
            namePrefix="contract"
            numInputs={6}
            {...props}
            values={values?.contract}
            errors={errors?.contract}
            touched={touched?.contract}
          />
          <HelperText
            helperText={t('GURB_POWER_HIGHER_15_HELPER')}
            iconHelper={true}
          />
        </>
      )}
    </>
  )
}
export default Power
