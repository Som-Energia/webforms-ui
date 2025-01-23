import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import SomStepper from '../../components/SomStepper'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

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
  textReviewSubtitle,
  textSubtitle2
} from '../../gurbTheme'
import ReviewField from '../../components/ReviewField'

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
    [
      {
        title: t('GURB_REVIEW_PRICES_ENERGY_TITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_PROCEDURE_TYPE_LABEL'),
            reviewValue: values.member.number
          },
          {
            reviewLabel: t('GURB_REVIEW_PROCEDURE_TYPE_LABEL'),
            reviewValue: values.member.number
          }
        ]
      },
      {
        title: t('GURB_REVIEW_PRICES_POWER_TITLE'),
        field: [
          {
            reviewLabel: t('GURB_REVIEW_PRICES_POWER_LABEL'),
            reviewValue: values.member.number
          },
          {
            reviewLabel: t('GURB_REVIEW_PRICES_POWER_LABEL'),
            reviewValue: values.member.number
          }
        ]
      }
    ]
  ]

  return (
    <>
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation title={t('GURB_CONTRACT_SUMMARY_TITLE')} />
        <SomStepper step={activeStep} connectors={7 + 1} />
        {reviewFields.map((rows, index) => {
          return (
            <>
              <Grid
                key={index}
                container
                columnSpacing={2}
                sx={{ marginY: '2rem' }}>
                {rows.map((details, index) => {
                  return (
                    <Grid
                      key={index}
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}>
                      {details.icon}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexDirection: 'column',
                          marginLeft: '2rem'
                        }}>
                        <Typography sx={textHeader4}>
                          {details.title}
                        </Typography>
                        {details.subtitle && (
                          <Typography sx={textBody1}>
                            {details.subtitle}
                          </Typography>
                        )}
                        {details.field &&
                          details.field.map((detail, index) => {
                            return (
                              <ReviewField
                                key={index}
                                label={detail.reviewLabel}
                                value={detail.reviewValue}
                              />
                            )
                          })}
                        {details.footer && (
                          <Typography sx={textSubtitle2}>
                            {details.footer}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
              <Divider />
            </>
          )
        })}
        <Grid
          container
          columnSpacing={2}
          sx={{
            marginLeft: '0.2rem',
            marginTop: '2rem',
            marginBottom: '-1rem'
          }}>
          <LocalOfferOutlinedIcon sx={iconRequirements} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: 'column',
              marginLeft: '2rem'
            }}>
            <Typography sx={textHeader4}>
              {t('GURB_PRICES_AFTER_TAXES')}
            </Typography>
          </Box>
        </Grid>
        {reviewPrices.map((rows, index) => {
          return (
            <>
              <Grid
                key={index}
                container
                columnSpacing={2}
                sx={{ marginBottom: '2rem', marginX: '2rem' }}>
                {rows.map((details, index) => {
                  return (
                    <Grid
                      key={index}
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}>
                      {details.icon}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexDirection: 'column',
                          marginLeft: '2rem',
                          marginBottom: '2rem'
                        }}>
                        <Typography sx={textReviewSubtitle}>
                          {details.title}
                        </Typography>
                        {details.field &&
                          details.field.map((detail, index) => {
                            return (
                              <ReviewField
                                key={index}
                                label={detail.reviewLabel}
                                value={detail.reviewValue}
                              />
                            )
                          })}
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </>
          )
        })}
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
