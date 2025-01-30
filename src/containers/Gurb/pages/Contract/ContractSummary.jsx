import { useContext, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import SomStepper from '../../components/SomStepper'
import { ReviewField, ReviewTable } from '../../components/ReviewField'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

import {
  iconRequirements,
  textBody1,
  textHeader4,
  textReviewLabel
} from '../../gurbTheme'
import { getPrices } from '../../../../services/api'
import { THOUSANDS_CONVERSION_FACTOR } from '../../../../services/utils'

import Loading from '../../../../components/Loading'

const ContractSummary = (props) => {
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

  const [loading, setLoading] = useState(true)
  const [prices, setPrices] = useState({})

  const reviewFields = [
    [
      {
        icon: <DescriptionOutlinedIcon sx={iconRequirements} />,
        title: t('GURB_REVIEW_PROCEDURE_TYPE_TITLE'),
        subtitle: t('GURB_REVIEW_PROCEDURE_TYPE_SUBTITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_PROCEDURE_TYPE_LABEL'),
            reviewValue: values.member.number
          }
        ]
      },
      {
        icon: <PersonIcon sx={iconRequirements} />,
        title: t('GURB_REVIEW_HOLDER_TITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_NAME'),
            reviewValue: `${values.holder.name} ${values.holder.surname1} ${values.holder.surname2}`
          },
          {
            reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_NIF'),
            reviewValue: values.holder.nif
          },
          {
            reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_PHONE'),
            reviewValue: values.holder.phone1
          },
          {
            reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_EMAIL'),
            reviewValue: values.holder.email
          }
        ]
      }
    ],
    [
      {
        icon: <LocationOnOutlinedIcon sx={iconRequirements} />,
        title: t('GURB_REVIEW_SUPPLY_POINT_TITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_CUPS'),
            reviewValue: values.cups
          },
          {
            reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
            reviewValue: `${values.address.street} ${values.address.number}`
          },
          {
            reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_CITY'),
            reviewValue: values.address.city
          },
          {
            reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_CNAE'),
            reviewValue: 'pendent field'
          }
        ]
      },
      {
        icon: <SettingsOutlinedIcon sx={iconRequirements} />,
        title: t('GURB_REVIEW_TECHNICAL_DETAILS_TITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_TECHNICAL_DETAILS_LABEL_TOLL'),
            reviewValue: 'Ni idea'
          },
          {
            reviewLabel: t('GURB_REVIEW_TECHNICAL_DETAILS_LABEL_TARIFF'),
            reviewValue: 'pendent'
          },
          {
            reviewLabel: t('GURB_REVIEW_TECHNICAL_DETAILS_LABEL_POWER'),
            reviewValue: 'en proces'
          }
        ],
        footer: t('GURB_REVIEW_TECHNICAL_DETAILS_FOOTER')
      }
    ],
    [
      {
        icon: <LocalPhoneOutlinedIcon sx={iconRequirements} />,
        title: t('GURB_REVIEW_CONTACT_INFORMATION_TITLE'),
        subtitle: t('GURB_REVIEW_CONTACT_INFORMATION_SUBTITLE')
      },
      {
        icon: <CreditCardOutlinedIcon sx={iconRequirements} />,
        title: t('GURB_REVIEW_PAYMENT_DATA_TITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_PAYMENT_DATA_LABEL_IBAN'),
            reviewValue: values.holder.iban
          },
          {
            reviewLabel: t('GURB_REVIEW_PAYMENT_DATA_LABEL_VOLUNTARY_DONATION'),
            reviewValue: values.holder.voluntary_donation
          }
        ]
      }
    ]
  ]

  const reviewPrices = [
    {
      title: t('GURB_REVIEW_PRICES_ENERGY_TITLE'),
      field: 'energia'
    },
    {
      title: t('GURB_REVIEW_PRICES_POWER_TITLE'),
      field: 'potencia'
    }
  ]

  const Prices = ({ concept, name }) => {
    let keys = concept ? Object.keys(concept) : []
    keys.sort()

    const differentValues = new Set(
      Object.keys(concept).map((key) => concept[key]?.value)
    )
    if (differentValues.size === 1) {
      for (const key in concept) {
        return (
          <ReviewField
            label={`${name}`}
            value={`${concept[key]?.value} ${concept[key]?.unit}`}
          />
        )
      }
    }
    const labels =
      keys.length === 2
        ? [t('PEAK'), t('VALLEY')]
        : keys.length === 3
        ? [t('PEAK'), t('FLAT'), t('VALLEY')]
        : keys

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>
        {concept ? (
          <Grid
            container
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
            {keys.map((key, index) => (
              <Grid item key={index}>
                <ReviewField
                  label={`${labels[index]}:`}
                  value={`${concept[key]?.value} ${concept[key]?.unit}`}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>{t('UNAVAILABLE')}</>
        )}
      </Box>
    )
  }

  console.log('VALUES', values, loading)
  useEffect(() => {
    console.log('useEffect!!')
    setLoading(true)
    let powerFields = Object.values(
      Object.fromEntries(
        Object.entries(values.contract.power).filter(([key]) =>
          key.startsWith('power')
        )
      )
    )
    let maxPower = Math.round(
      Math.max(...powerFields) * THOUSANDS_CONVERSION_FACTOR
    )
    getPrices({
      tariff: '2.0TD', // values.contract.tariff,
      max_power: '5000',
      vat: '60973654X', //values.holder.dni,
      cnae: '9820', // values.supply_point.cnae,
      city_id: 5102 // values.address.city
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
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <>
      {/* <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}> */}

      <TextRecomendation title={t('GURB_CONTRACT_SUMMARY_TITLE')} />
      <SomStepper step={activeStep} connectors={7 + 1} />
      <ReviewTable tableFields={reviewFields} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'row',
          marginY: '2rem',
          gap: '2rem'
        }}>
        <LocalOfferOutlinedIcon sx={iconRequirements} />
        <Box>
          <Typography sx={textHeader4}>
            {t('GURB_REVIEW_PRICES_POWER_TITLE')}
          </Typography>

          <Grid container columnSpacing={2}>
            {reviewPrices.map((detail, index) => {
              return (
                <Grid
                  key={index}
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginY: '1rem'
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                    <Typography sx={textReviewLabel}>
                      {t(detail.title)}
                    </Typography>
                    <Prices concept={prices?.[`${detail.field}`]} />
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Box>

      <Typography
        sx={{ ...textBody1, marginBottom: '1rem', marginTop: '4rem' }}
        variant="body2"
        dangerouslySetInnerHTML={{
          __html: t('GURB_SUMMARY_INFO', {
            url_som_tariff: t('URL_WEB_SOM_TARIFF'),
            url_rdl: t('URL_RDL_2022'),
            url_omie: t('URL_OMIE'),
            url_red_electrica: t('URL_RED_ELECTRICA'),
            url_boe_310: t('URL_BOE_310')
          })
        }}
      />
      <Typography
        sx={{ ...textHeader4, marginBottom: '1rem', marginTop: '2rem' }}>
        {t('GURB_SUMMARY_OTHER_CONCEPTS_TITLE')}
      </Typography>

      <Typography
        sx={{ ...textBody1, marginBottom: '4rem' }}
        variant="body2"
        dangerouslySetInnerHTML={{
          __html: t('GURB_SUMMARY_OTHER_CONCEPTS_BODY')
        }}
      />
    </>
  )
}
export default ContractSummary
