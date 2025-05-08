import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

import ReviewTable from '../../components/review/ReviewTable'
import ReviewPricesTable from '../../components/review/ReviewPrices'
import InputTitle from '../../components/InputTitle'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import PersonIcon from '@mui/icons-material/Person'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import { iconRequirements } from '../../themes/commonStyles'
import { NEW_MEMBER_CONTRACT_FORM_SUBSTEPS } from '../../services/steps'
import { getPrices } from '../../services/api'
import { THOUSANDS_CONVERSION_FACTOR } from '../../services/utils'

import Loading from '../../components/Loading'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'

const NewContractMemberSummary = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched,
  } = props

  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [prices, setPrices] = useState({})

  const languages = {
    es_ES: 'Español',
    ca_ES: 'Català',
    eu_ES: 'Euskera',
    gl_ES: 'Galego',
  }

  const legalReviewFields = {
    icon: <PersonIcon sx={iconRequirements} />,
    title: t('GURB_REVIEW_HOLDER_TITLE'),
    field: [
      {
        reviewLabel: t('BUSINESS_NAME'),
        reviewValue: values?.new_member?.name,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
      },
      {
        reviewLabel: t('CIF'),
        reviewValue: values?.new_member?.nif,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['IDENTIFY_MEMBER'],
      },
      {
        reviewLabel: t('PROXY'),
        reviewValue: `${values?.new_member?.proxyname} (${values?.new_member?.proxynif})`,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
      },
      {
        reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
        reviewValue: `${values?.address?.street} ${values?.address?.number}`,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
      },
      {
        reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_CITY'),
        reviewValue: values?.address?.city?.name,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
      },
    ],
  }

  const physicalReviewFields = {
    icon: <PersonIcon sx={iconRequirements} />,
    title: t('GURB_REVIEW_HOLDER_TITLE'),
    field: [
      {
        reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_NAME'),
        reviewValue: `${values?.new_member?.name} ${values?.new_member?.surname1} ${values?.new_member?.surname2}`,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
      },
      {
        reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_NIF'),
        reviewValue: values?.new_member?.nif,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['IDENTIFY_MEMBER'],
      },
      {
        reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_PHONE'),
        reviewValue: `(${values?.new_member?.phone_code}) ${values?.new_member?.phone}`,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
      },
      {
        reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_EMAIL'),
        reviewValue: values?.new_member?.email,
        step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
      },
    ],
  }

  const reviewFields = [
    [
      {
        icon: <DescriptionOutlinedIcon sx={iconRequirements}/>,
        title: t('REVIEW_PROCESS_TITLE'),
        field: [
          {
            reviewValue: t('NEW_MEMBER_SUMMARY_PROCESS'),
          },
          {
            reviewValue: t('NEW_CONTRACT_SUMMARY_PROCESS'),
          }
        ]
      },
      values?.new_member?.is_physical == 'physic-person' ? physicalReviewFields : physicalReviewFields
    ],
    [
      {
        icon: <PlaceOutlinedIcon sx={iconRequirements} />,
        title: t('SUPPLY'),
        field: [
          {
            reviewLabel: t('CUPS_LABEL'),
            reviewValue: values?.cups,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['PAYMENT_INFO'],
          },
          {
            reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
            reviewValue: `${values?.address?.street} ${values?.address?.number}`,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
          },
          {
            reviewLabel: t('GURB_REVIEW_SUPPLY_POINT_LABEL_CITY'),
            reviewValue: values?.address?.city?.name,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
          },
          {
            reviewLabel: 'CNAE',
            reviewValue: values?.supply_point.CNAE,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['DONATION'],
          },
        ]
      },
      {
        icon: <SettingsOutlinedIcon sx={iconRequirements} />,
        title: t('TECHNICAL_DATA_SUMMARY'),
        field: [
          {
            reviewLabel: t('TOLL'),
            reviewValue: t('CURRENT'),
          },
          {
            reviewLabel: t('FARE'),
            reviewValue: values?.contract.tariff_mode,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
          },
          {
            reviewLabel: t('POWER'),
            reviewValue: t('CURRENT'),
          },
          {
            reviewValue: t('GURB_REVIEW_TECHNICAL_DETAILS_FOOTER')
          }
        ],
      },
    ],
    [
      {
        icon: <LocalPhoneOutlinedIcon sx={iconRequirements} />,
        title: t('GURB_REVIEW_CONTACT_INFORMATION_TITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_PHONE'),
            reviewValue: `(${values?.new_member?.phone_code}) ${values?.new_member?.phone}`,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
          },
          {
            reviewLabel: t('GURB_REVIEW_HOLDER_LABEL_EMAIL'),
            reviewValue: values?.new_member?.email,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
          },
          {
            reviewLabel: t('LANGUAGE'),
            reviewValue: languages[values?.new_member?.language],
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO'],
          },
        ],
      },
      {
        icon: <CreditCardOutlinedIcon sx={iconRequirements} />,
        title: t('GURB_REVIEW_PAYMENT_DATA_TITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_PAYMENT_DATA_LABEL_IBAN'),
            reviewValue: values?.new_member?.iban,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['PAYMENT_INFO'],
          },
          {
            reviewLabel: t('VOLUNTARY_CENT'),
            reviewValue: values?.voluntari_donation,
            step: NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['DONATION']
          },
        ]
      }
    ],
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

  useEffect((values) => {
    console.log('values prices', values)
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
      vat: values.new_member.nif,
      cnae: values.supply_point.cnae,
      city_id: values.supply_point_address.city.id
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

  const handleCheckboxChange = async (event, fieldName) => {
    let value = event.target.checked
    await setFieldValue(fieldName, value)
    setFieldTouched(fieldName, true)
  }

  return loading ? (
    <Loading />
  ) : (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">{t('MEMBER_PAGE_SUMMARY')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle text={t('MEMBER_PAGE_SUMMARY_QUESTION')} />
      </Grid>
      <Grid item xs={12}>
        <ReviewTable tableFields={reviewFields} />
      </Grid>
      <Grid item xs={12}>
        <ReviewPricesTable reviewPrices={reviewPrices} prices={prices} />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="terms_accepted"
              checked={values?.new_member?.terms_accepted}
              onChange={(event) => {
                handleCheckboxChange(event, 'new_member.terms_accepted')
              }}
            />
          }
          label={t('ACCEPT_TERMS')}
        />
      </Grid>
      {values?.new_member?.person_type == 'legal-person' && (
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                data-cy="comercial_info_accepted"
                checked={values?.new_member?.comercial_info_accepted}
                onChange={(event) => {
                  handleCheckboxChange(
                    event,
                    'new_member.comercial_info_accepted'
                  )
                }}
              />
            }
            label={t('COMERCIAL_INFO_ACCEPTED')}
          />
        </Grid>
      )}
    </Grid>
  )
}

export default NewContractMemberSummary
