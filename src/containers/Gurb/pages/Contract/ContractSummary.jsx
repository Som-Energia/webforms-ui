import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import ReviewTable from '../../components/review/ReviewTable'
import ReviewPricesTable from '../../components/review/ReviewPrices'

import Typography from '@mui/material/Typography'

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'

import { iconRequirements, textBody1, textHeader4 } from '../../gurbTheme'
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
            reviewValue: values.address.city.name
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

  useEffect(() => {
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
      tariff:
        values.contract.power_type === 'power-higher-15kw' ? '3.0TD' : '2.0TD',
      max_power: maxPower,
      vat: values.holder.nif,
      cnae: values.supply_point.cnae,
      city_id: values.address.city.id
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ReviewTable tableFields={reviewFields} />
      </Grid>
      <Grid item xs={12}>
        <ReviewPricesTable reviewPrices={reviewPrices} prices={prices} />
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={{ ...textBody1 }}
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
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={{ ...textHeader4 }}>
          {t('GURB_SUMMARY_OTHER_CONCEPTS_TITLE')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={{ ...textBody1}}
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t('GURB_SUMMARY_OTHER_CONCEPTS_BODY')
          }}
        />
      </Grid>
    </Grid>
  )
}
export default ContractSummary
