import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { textHeader4, textField, textHeader5, textHeader2 } from '../../gurbTheme'
import Box from '@mui/material/Box'
import Select from '../../components/Select'
import Alert from '@mui/material/Alert'
import { getPowers } from '../../../../services/api'

const GurbParticipation = (props) => {
  const { values, setFieldValue, gurbCode } = props
  const { t } = useTranslation()
  const [gurbDetails, setGurbDetails] = useState({})

  const getAvailablePowers = useCallback(() => {
    getPowers(gurbCode, values.tariff_name)
      .then((response) => {
        setGurbDetails({
          ...response.data,
          available_betas: response.data.available_betas.map((item, index) => ({
            id: index + 1,
            value: item,
            text: `${item} kW`
          }))
        })
        setFieldValue('gurb.join_cost', response.data.initial_quota)
      })
      .catch(error => console.log(error))
  }, [gurbCode, values.tariff_name])

  useEffect(() => {
    getAvailablePowers()
  }, [getAvailablePowers])


  const onChangePower = useCallback(async (value) => {
    await setFieldValue('gurb.power', value)
    await setFieldValue('gurb.daily_cost', Number(gurbDetails.quota * value))
  }, [setFieldValue, gurbDetails])


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography sx={{ ...textHeader2, mb: 5 }}>{t('GURB_PARTICIPATION')}</Typography>
      <Typography sx={textHeader4}>{t('GURB_PARTICIPATION_KW_INPUT_TEXT')}</Typography>
      <Typography sx={textHeader5}>{t('GURB_PARTICIPATION_KW_INPUT_TEXT_SECONDARY')}</Typography>
      <Select
        options={gurbDetails.available_betas ?? []}
        value={values.gurb.power}
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
        __html: t('GURB_PARTICIPATION_TEXT_1', { initial_quota: gurbDetails.initial_quota })
      }} /> </Alert>
      {gurbDetails.surplus_compensation && <Alert severity='info'><Typography variant='body2' align='justify' dangerouslySetInnerHTML={{
        __html: t('GURB_PARTICIPATION_TEXT_2')
      }} /> </Alert>}
    </Box>
  )
}

export default GurbParticipation
