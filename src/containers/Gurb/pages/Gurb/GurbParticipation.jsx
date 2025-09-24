import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader4, textField, textHeader5, textHeader2 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import Select from '../../components/Select'
import Alert from '@mui/material/Alert'
import { getPowers } from '../../../../services/api'

const Contract = (props) => {
  const [gurbDetails, setGurbDetails] = useState({})

  const cost = {
    "1 KWh": 180,
    "0.5 KWh": 90
  }

  const getAvailablePowers = () => {
    getPowers('G003', '2.0TD')
      .then((response) => {
        setGurbDetails({
          ...response.data,
          available_betas: response.data.available_betas.map((item, index) => ({
            id: index + 1,
            value: item,
            text: `${item} kW`
          }))
        })
      })
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
      <Typography sx={{ ...textHeader2, mb: 5 }}>{t('GURB_PARTICIPATION')}</Typography>
      <Typography sx={textHeader4}>{t('GURB_PARTICIPATION_KW_INPUT_TEXT')}</Typography>
      <Typography sx={textHeader5}>{t('GURB_PARTICIPATION_KW_INPUT_TEXT_SECONDARY')}</Typography>
      <Select
        options={gurbDetails.available_betas ?? []}
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
        __html: t('GURB_PARTICIPATION_TEXT_1', {initial_quota: gurbDetails.initial_quota})
      }} /> </Alert>
      {gurbDetails.surplus_compensation && <Alert severity='info'><Typography variant='body2' align='justify' dangerouslySetInnerHTML={{
        __html: t('GURB_PARTICIPATION_TEXT_2')
      }} /> </Alert>}
    </Box>
  )
}

export default Contract
