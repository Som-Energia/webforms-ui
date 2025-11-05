import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import {
  textField,
  textHeader5,
  participationTypography,
  participationAlertBoxTypography,
  participationAlertBoxIcon
} from '../../gurbTheme'
import Box from '@mui/material/Box'
import Select from '../../components/Select'
import AlertBox from '../../../../components/AlertBox'
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
      .catch((error) => console.log(error))
  }, [gurbCode, values.tariff_name])

  useEffect(() => {
    getAvailablePowers()
  }, [getAvailablePowers])

  const onChangePower = useCallback(
    async (value) => {
      await setFieldValue('gurb.power', value)
      await setFieldValue('gurb.daily_cost', Number(gurbDetails.quota * value))
    },
    [setFieldValue, gurbDetails]
  )

  const TWENTY_TD_TARIFF = '2.0TD'
  const informationTextKey =
    values.tariff_name === TWENTY_TD_TARIFF
      ? 'GURB_PARTICIPATION_TEXT_20'
      : 'GURB_PARTICIPATION_TEXT_30'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

      <Typography variant="headline4.regular">
        {t('GURB_PARTICIPATION_KW_INPUT_TEXT')}
      </Typography>

      <Typography sx={textHeader5}>
        {t('GURB_PARTICIPATION_KW_INPUT_TEXT_SECONDARY')}
      </Typography>

      <Select
        options={gurbDetails.available_betas ?? []}
        value={values.gurb.power}
        handleChange={(value) => onChangePower(value)}
        style={textField}
      />

      <Typography
        sx={participationTypography}>
        {
          <span
            dangerouslySetInnerHTML={{
              __html: t('GURB_HELP_ANNUAL_CONSUMPTION', {
                url: t('GURB_HELP_ANNUAL_CONSUMPTION_URL')
              })
            }}></span>
        }
      </Typography>

      <Box sx ={{ mt: 4 }}>
        <AlertBox
          customTypographyStyle={participationAlertBoxTypography}
          customIconStyle={participationAlertBoxIcon}
          id="gurb_participation_info_alert"
          description={t(informationTextKey)}
          severity={'warning'}
          iconCustom={true}
          iconCustomSeverity="info"
          variant={'body2'}
        />
      </Box>
    </Box>
  )
}

export default GurbParticipation
