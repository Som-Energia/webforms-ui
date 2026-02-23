import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { SummaryPeriodChart, SummaryPricesDisplay, Loading, SomDatePicker, DizzyError } from '@somenergia/somenergia-ui'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getCompensationIndexedPrices, getIndexedTariffPrices } from '../../services/api'
import {
  transformIndexedTariffPrices,
  computeTotals,
  dayIsMissing,
  computeMaxYAxisValue,
  computeMinYAxisValue,
} from '../../services/indexedTariffs.utils'
import TariffSelector from '../../components/TariffSelector/TariffSelector'
import { DefaultTariff, Tariffs } from '../../data/tariff'

const IndexedDailyPrices = () => {
  const { language } = useParams()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const [tariff, setTariff] = useState(DefaultTariff)
  const [firstDate, setFirstDate] = useState(null)
  const [prices, setPrices] = useState(null)
  const [calendarDay, setCalendarDay] = useState(dayjs().startOf('day'))

  const totalPrices = React.useMemo(() => {
    if (!firstDate) {
      return false
    }

    return computeTotals(firstDate, calendarDay, prices)
  }, [firstDate, calendarDay, prices])

  const indexedTariffPrices = React.useMemo(() => {
    if (!firstDate) return false
    return transformIndexedTariffPrices(firstDate, calendarDay, prices)
  }, [firstDate, calendarDay, prices])

  const referenceLineData = [
    {
      value: indexedTariffPrices.week_average,
      color: '#446BC1',
      stroke: '3 3',
      strokeWidth: 2,
      text: t('CHART_WEEKLY_AVERAGE_LEGEND', {
        base_days_computation: indexedTariffPrices['base_days_computation'],
      }),
    },
    {
      value: indexedTariffPrices.day_average,
      color: '#446BC1',
      stroke: '0',
      strokeWidth: 2,
      text: t('CHART_DAILY_AVERAGE_LEGEND'),
    },
  ]

  const totalPricesData = [
    {
      value: totalPrices['MIN'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY_TOTAL_MIN'),
    },
    {
      value: totalPrices['MAX'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY_TOTAL_MAX'),
    },
    {
      value: totalPrices['AVERAGE'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY_TOTAL_AVERAGE'),
    },
    {
      value: totalPrices['WEEKLY_AVERAGE'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY_TOTAL_WEEKLY_AVERAGE', {
        base_days_computation: totalPrices['BASE_DAYS_COMPUTATION'],
      }),
    },
  ]

  const tickCountValue = 7 // Number of yAxis values

  const [error, setError] = useState(false)

  useEffect(() => {
    const getPrices = async (tariffName) => {
      setError(false)
      if (tariffName === Tariffs.SURPLUS_COMPENSATION) {
        const data = await getCompensationIndexedPrices({
          geoZone: 'PENINSULA',
        })
        setFirstDate(data.first_date)
        setPrices(data.curves.compensation_euros_kwh)
      } else {
        try {
          const data = await getIndexedTariffPrices({
            tariff: tariffName,
            geoZone: 'PENINSULA',
          })
          setFirstDate(data.first_date)
          setPrices(data.curves.price_euros_kwh)
        } catch (error) {
          setError(true)
        }
      }
    }
    getPrices(tariff)
  }, [tariff])

  const ErrorBox = ({ message }) => (
    <Box sx={{ textAlign: 'center' }}>
      <DizzyError />
      <Typography>{message}</Typography>
    </Box>
  )

  const ErrorDataAvailabilityBox = ({ message }) => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography>{message}</Typography>
    </Box>
  )

  const changeTariff = (selectedTariff) => {
    setTariff(selectedTariff)
  }

  return (
    <>
      <TariffSelector tariff={tariff} onSelectTariff={changeTariff} />
      <Box margin={8} display="flex" justifyContent="center" alignItems="center">
        <SomDatePicker
          firstDate={dayjs().subtract(7, 'day').startOf('day')}
          lastDate={dayjs().add(1, 'day').endOf('day')}
          period="DAILY"
          currentTime={calendarDay}
          setCurrentTime={setCalendarDay}
          styles={{
            datePicker: {
              minWidth: '110px',
              textAlign: 'center',
              input: {
                textAlign: 'center',
              },
            },
          }}
        />
      </Box>

      {error ? (
        <ErrorBox message={t('API_ERROR_FETCHING_DATA')} />
      ) : !indexedTariffPrices ? (
        <Loading />
      ) : !dayIsMissing(indexedTariffPrices.periods) ? (
        <>
          <SummaryPeriodChart
            data={indexedTariffPrices}
            period="DAILY"
            Ylegend={'€/kWh'}
            legend={true}
            showTooltipKeys={false}
            referenceLineData={referenceLineData}
            tickCount={tickCountValue}
            maxYAxisValue={computeMaxYAxisValue(totalPrices, tickCountValue)}
            minYAxisValue={computeMinYAxisValue(totalPrices, tickCountValue)}
          />
          <Box sx={{ marginTop: '40px' }}>
            <SummaryPricesDisplay totalPrices={totalPricesData} />
          </Box>
        </>
      ) : (
        <ErrorDataAvailabilityBox message={t('PRICES_ERROR_MISSING_DATA')} />
      )}
    </>
  )
}

export default IndexedDailyPrices
