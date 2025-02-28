import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader4, textField, textHeader5 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import Select from '../../components/Select'
import Alert from '@mui/material/Alert'
import { getPowers } from '../../../../services/api'

const Contract = (props) => {

  const [powers, setPowers] = useState([])

  const cost = {
    "1 KWh": 180,
    "0.5 KWh": 90
  }

  const getAvailablePowers = () => {
    getPowers(1)
      .then(response => setPowers(response.data))
      .catch(error => console.log(error))
  }

  useEffect(() => {
    getAvailablePowers()
  }, [])

  const { values, setFieldValue } = props
  const { t } = useTranslation()


  const onChangePower = async (value) => {
    await setFieldValue('contract.gurb_power', value)
    await setFieldValue('contract.gurb_power_cost', cost[value])
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography sx={textHeader4}>{t('GURB_PARTICIPATION_KW_INPUT_TEXT')}</Typography>
      <Typography sx={textHeader5}>{t('GURB_PARTICIPATION_KW_INPUT_TEXT_SECONDARY')}</Typography>
      <Select
        options={powers}
        value={values.contract.gurb_power}
        handleChange={(value) => onChangePower(value)}
        style={textField}
        helperText={
          <span
            dangerouslySetInnerHTML={{
              __html: t('GURB_HELP_ANNUAL_CONSUMPTION', {
                url: t('GURB_HELP_ANNUAL_CONSUMPTION_URL')
              })
            }}
          />
        }
      />
      <Alert severity='info'><Typography variant='body2' align='justify' dangerouslySetInnerHTML={{
        __html: t('GURB_PARTICIPATION_TEXT_1')
      }} /> </Alert>
      <Alert severity='info'><Typography variant='body2' align='justify' dangerouslySetInnerHTML={{
        __html: t('GURB_PARTICIPATION_TEXT_2')
      }} /> </Alert>
    </Box>
  )
}

export default Contract
