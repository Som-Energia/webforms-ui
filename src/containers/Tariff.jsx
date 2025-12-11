import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { getPrices } from '../services/api'

const Tariff = (props) => {
  const { tariff, taxes = true, taxValue = 21 } = props
  const { language } = useParams()
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState()
  const [prices, setPrices] = useState()
  const [taxType, setTaxType] = useState(taxValue)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

 useEffect(() => {
    const CITY_TAX_21 = 20
    const CITY_TAX_10 = 37

    setLoading(true)
    getPrices({
      tariff,
      city_id: taxType === 21 ? CITY_TAX_21 : CITY_TAX_10
    })
      .then((response) => {
        const tariffPrices = response?.data['current']
        setPrices(tariffPrices)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error(error)
      })
  }, [taxType, tariff])

  const btnTaxStyle = {
    width: '120px',
    height: '40px',
    lineHeight: '40px',
    fontSize: '1em'
  }
  const powerPeriodNames = {
    '2.0TD_P1': t('POWER_TERM_20TD_P1'),
    '2.0TD_P2': t('POWER_TERM_20TD_P2')
  }
  const energyPeriodNames = {
    '2.0TD_P1': t('ENERGY_TERM_20TD_P1'),
    '2.0TD_P2': t('ENERGY_TERM_20TD_P2'),
    '2.0TD_P3': t('ENERGY_TERM_20TD_P3')
  }

  return (
    <div className="tariff-table">
      {loading ? (
        ''
      ) : (
        <>
          {taxes && (
            <div className="triaimpost">
              <ul style={{ display: 'flex', marginBottom: '16px' }}>
                <li
                  id="tab_deu"
                  className={taxType === 10 ? 'deu_triat' : 'deu_notriat'}
                  style={{ ...btnTaxStyle }}
                  onClick={(event) => setTaxType(10)}>
                  10% IVA
                </li>
                <li
                  id="tab_vintiu"
                  className={taxType === 21 ? 'vintiu_triat' : 'vintiu_notriat'}
                  style={{ ...btnTaxStyle }}
                  onClick={(event) => setTaxType(21)}>
                  21% IVA
                </li>
              </ul>
            </div>
          )}
          <div className="tp">
            <h4>{t('POWER_TERM')}</h4>
            <p className="titol">
              {prices?.potencia &&
                Object.keys(prices?.potencia)
                  .reverse()
                  .map((period) => (
                    <span key={period}>
                      {powerPeriodNames[`${tariff}_${period}`] ?? period}{' '}
                      {prices.potencia[period]?.value} {prices.potencia[period]?.unit}
                      <br />
                    </span>
                  ))}
            </p>
          </div>
          <div className="te">
            <h4>{t('ENERGY_TERM')}</h4>
            <p className="titol">
              {prices?.energia &&
                Object.keys(prices?.energia)
                  .reverse()
                  .map((period) => (
                    <span key={period}>
                      {energyPeriodNames[`${tariff}_${period}`] ?? period}{' '}
                      {prices.energia[period]?.value} {prices.energia[period]?.unit}
                      <br />
                    </span>
                  ))}
            </p>
          </div>
          <div className="te-generation">
            <h4
              dangerouslySetInnerHTML={{
                __html: t('ENERGY_TERM_GENERATIONKWH', {
                  url: t('GENERATION_URL')
                })
              }}></h4>
            <p className="titol">
              {prices?.generation_kWh &&
                Object.keys(prices?.generation_kWh)
                  .reverse()
                  .map((period) => (
                    <span key={period}>
                      {energyPeriodNames[`${tariff}_${period}`] ?? period}{' '}
                      {prices.generation_kWh[period]?.value} {prices.generation_kWh[period]?.unit}
                      <br />
                    </span>
                  ))}
            </p>
          </div>
          <div className="autoproduction">
            <h4
              dangerouslySetInnerHTML={{
                __html: t('SELFCONSUMPTION_WITH_FAQ', {
                  url: t('FAQ_SELFCONSUMPTION_URL')
                })
              }}></h4>
            <p className="titol">
              {prices?.energia_autoconsumida &&
                Object.keys(prices?.energia_autoconsumida)
                  .reverse()
                  .map((period) => (
                    <span key={period}>
                      {prices.energia_autoconsumida[period]?.value} {prices.energia_autoconsumida[period]?.unit}
                      <br />
                    </span>
                  ))}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Tariff
