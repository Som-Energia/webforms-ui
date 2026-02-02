import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

import SelectField from '../../../../components/SelectField/SelectField'
import AlertBox from '../../../../components/AlertBox/AlertBox'
import { getPowers } from '../../../../services/api'
import TextRecommendation from '../../components/TextRecommendation/TextRecommendation'


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
            id: item,
            name: `${item} kW`
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
    async (event) => {
      await setFieldValue('gurb.power', event.target.value)
      await setFieldValue('gurb.daily_cost', Number(gurbDetails.quota * event.target.value))
      await setFieldValue('gurb.surplus_compensation', gurbDetails.surplus_compensation)
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

      <TextRecommendation
        required={true}
        isHeader={true}
        title={t('GURB_PARTICIPATION_KW_INPUT_TEXT')}
        text={t('GURB_PARTICIPATION_KW_INPUT_TEXT_SECONDARY')}
      />
      <SelectField
        options={gurbDetails.available_betas ?? []}
        value={values.gurb.power}
        fieldName={"values.gurb.power"}
        onChange={onChangePower}
      />

      <Typography //TODO: Extract as component (Same as GurbParticipation)
        sx={{
          fontSize: '14px',
          fontWeight: 400,
          letterSpacing: 0,
          color: 'secondary.extraDark'
        }}>
        {''}
        <Link
          href={t('GURB_HELP_ANNUAL_CONSUMPTION_URL')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('GURB_HELP_ANNUAL_CONSUMPTION')}
        </Link>
      </Typography>
      <Box sx={{ mt: 4 }}>
        <AlertBox
          textAlign={'left'}
          id="gurb_participation_info_alert"
          description={t(informationTextKey)}
          severity={'warning'}
          icon="info"
          variant={'body.md.regular'}
        />
      </Box>
    </Box>
  )
}

export default GurbParticipation
