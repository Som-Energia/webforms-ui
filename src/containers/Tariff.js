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
            <h4>{t('TERME_POTENCIA')}</h4>
            <p className="titol">
              {prices?.potencia &&
                Object.keys(prices?.potencia)
                  .reverse()
                  .map((key) => (
                    <span key={key}>
                      {tariff === '2.0TD'
                        ? t(`TERME_POTENCIA_${key}_${tariff}`)
                        : key}{' '}
                      {prices.potencia[key]?.value} {prices.potencia[key]?.unit}
                      <br />
                    </span>
                  ))}
            </p>
          </div>
          <div className="te">
            <h4>{t('TERME_ENERGIA')}</h4>
            <p className="titol">
              {prices?.energia &&
                Object.keys(prices?.energia)
                  .reverse()
                  .map((key) => (
                    <span key={key}>
                      {tariff === '2.0TD'
                        ? t(`TERME_ENERGIA_${key}_${tariff}`)
                        : key}{' '}
                      {prices.energia[key]?.value} {prices.energia[key]?.unit}
                      <br />
                    </span>
                  ))}
            </p>
          </div>
          <div className="te-generation">
            <h4
              dangerouslySetInnerHTML={{
                __html: t('TERME_ENERGIA_GENERATIONKWH', {
                  url: t('GENERATION_URL')
                })
              }}></h4>
            <p className="titol">
              {prices?.generation_kWh &&
                Object.keys(prices?.generation_kWh)
                  .reverse()
                  .map((key) => (
                    <span key={key}>
                      {tariff === '2.0TD'
                        ? t(`TERME_ENERGIA_${key}_${tariff}`)
                        : key}{' '}
                      {prices.generation_kWh[key]?.value} {prices.generation_kWh[key]?.unit}
                      <br />
                    </span>
                  ))}
            </p>
          </div>
          <div className="autoproduction">
            <h4
              dangerouslySetInnerHTML={{
                __html: t('AUTOCONSUM_WITH_FAQ', {
                  url: t('FAQ_AUTOCONSUM_URL')
                })
              }}></h4>
            <p className="titol">
              {prices?.energia_autoconsumida &&
                Object.keys(prices?.energia_autoconsumida)
                  .reverse()
                  .map((key) => (
                    <span key={key}>
                      {tariff === '2.0TD'
                        ? t(`TERME_AUTOCONUNM_${key}_${tariff}`)
                        : key}{' '}
                      {prices.energia_autoconsumida[key]?.value} {prices.energia_autoconsumida[key]?.unit}
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
