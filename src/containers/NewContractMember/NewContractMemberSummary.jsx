import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReviewTable from '../../components/review/ReviewTable'
import ReviewPricesTable from '../../components/review/ReviewPrices'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { buttonGurbLight } from '../../containers/Gurb/gurbTheme'
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TermsDialog from '../../components/TermsDialog'
import LegalText from '../../components/LegalText'

import { getPrices } from '../../services/api'
import { THOUSANDS_CONVERSION_FACTOR } from '../../services/utils'

import { NEW_MEMBER_CONTRACT_FORM_SUBSTEPS, NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS } from '../../services/steps'
import Loading from '../../components/Loading'
import { InvoiceIcon, PersonalIcon, PlaceMapIcon, ConfigIcon, PhoneIcon, CreditCardIcon, PricetagIcon } from '../../data/icons/Icons'

const TARIFF_INDEXED = 'indexed'

const NewContractMemberSummary = (props) => {
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
  const { tariff } = useParams()
  const isTariffIndexed = tariff === TARIFF_INDEXED

  const [loading, setLoading] = useState(false)
  const [prices, setPrices] = useState({})
  const [openGeneralTermsDialog, setOpenGeneralTermsDialog] = useState(false)
  const [showReviewLinks, setShowReviewLinks] = useState(false)

  const formSteps = values?.has_member == 'member-off'
    ? NEW_MEMBER_CONTRACT_FORM_SUBSTEPS
    : values?.has_member == 'member-on'
      ? NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS
      : undefined

  const handleChangePrivacyPolicy = (event) => {
    const checked = event.target.checked
    setFieldValue('privacy_policy_accepted', checked)
    setFieldTouched('privacy_policy_accepted', true)
  }

  const handleAcceptGeneralTerms = () => {
    setFieldValue('generic_conditions_accepted', true)
    setOpenGeneralTermsDialog(false)
  }

  const handleCloseGeneralTerms = () => {
    setFieldValue('generic_conditions_accepted', false)
    setOpenGeneralTermsDialog(false)
  }

  const handleChangeStatutes = (event) => {
    const checked = event.target.checked
    setFieldValue('statutes_accepted', checked)
    setFieldTouched('statutes_accepted', true)
  }

  const languages = {
    es_ES: 'Español',
    ca_ES: 'Català',
    eu_ES: 'Euskera',
    gl_ES: 'Galego'
  }

  const legalReviewFields = {
    icon: <PersonalIcon />,
    title: t('REVIEW_HOLDER_TITLE'),
    field: [
      {
        reviewLabel: t('BUSINESS_NAME'),
        reviewValue: values?.new_member?.name,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('CIF'),
        reviewValue: values?.new_member?.nif,
        step: showReviewLinks
          ? values?.has_member == 'member-off'
            ? formSteps['IDENTIFY_MEMBER']
            : formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('PROXY'),
        reviewValue: `${values?.new_member?.proxyname} (${values?.new_member?.proxynif})`,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
        reviewValue: `${values?.address?.street} ${values?.address?.number}`,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_CITY'),
        reviewValue: values?.address?.city?.name,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      }
    ]
  }

  const physicalReviewFields = {
    icon: <PersonalIcon />,
    title: t('REVIEW_HOLDER_TITLE'),
    field: [
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_NAME'),
        reviewValue: `${values?.new_member?.name} ${values?.new_member?.surname1} ${values?.new_member?.surname2}`,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_NIF'),
        reviewValue: values?.new_member?.nif,
        step: showReviewLinks
          ? values?.has_member == 'member-off'
            ? formSteps['IDENTIFY_MEMBER']
            : formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_PHONE'),
        reviewValue: `(${values?.new_member?.phone_code}) ${values?.new_member?.phone}`,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_EMAIL'),
        reviewValue: values?.new_member?.email,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      }
    ]
  }

  const oldHolderFields = [
    {
      reviewLabel: t('REVIEW_HOLDER_LABEL_NIF'),
      reviewValue: values?.member?.nif,
      step: showReviewLinks
        ? formSteps['LINK_MEMBER']
        : null
    }
  ]

  const reviewHolderData = values?.member_is_holder == 'holder-member-yes'
    ? oldHolderFields
    : values?.new_member?.person_type == 'legal-person'
      ? legalReviewFields
      : physicalReviewFields

  const summary_process = values?.previous_holder == 'prevuis-holder-yes'
    ? t('NEW_CONTRACT_OLD_HOLDER_SUMMARY_PROCESS')
    : t('NEW_CONTRACT_NEW_HOLDER_SUMMARY_PROCESS')

  const reviewProcessFields = values?.has_member == 'member-off' ?
    [
      {
        reviewValue: t('NEW_MEMBER_SUMMARY_PROCESS')
      },
      {
        reviewValue: summary_process
      }
    ] : [
      {
        reviewValue: summary_process
      },
      {
        reviewLabel: t('REVIEW_LINK_PERSON'),
        reviewValue: values?.member?.nif,
        step: showReviewLinks
          ? formSteps['LINK_MEMBER']
          : null
      }
    ]

  const reviewContactData = values?.member_is_holder == 'holder-member-yes'
    ? [
      {
        reviewValue: t('REVIEW_CONTACT_OLD_HOLDER')
      }
    ]
    : [
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_PHONE'),
        reviewValue: `(${values?.new_member?.phone_code}) ${values?.new_member?.phone}`,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('REVIEW_HOLDER_LABEL_EMAIL'),
        reviewValue: values?.new_member?.email,
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      },
      {
        reviewLabel: t('LANGUAGE'),
        reviewValue: languages[values?.new_member?.language],
        step: showReviewLinks
          ? formSteps['MEMBER_INFO']
          : null
      }
    ]



  const getPaymentField = () => {

    let paymentFields = [{
      reviewLabel: t('REVIEW_PAYMENT_DATA'),
      reviewValue: t('REVIEW_PAYMENT_DATA_QUANTITY')
    },
    {
      reviewLabel: t('REVIEW_PAYMENT_DATA_LABEL_IBAN'),
      reviewValue: values?.new_member?.iban,
      step: showReviewLinks
        ? formSteps['PAYMENT_INFO']
        : null
    },
    {
      reviewLabel: t('VOLUNTARY_CENT_SUMMARY'),
      reviewValue: values?.voluntary_donation ? t('YES') : t('NO'),
      step: showReviewLinks
        ? formSteps['DONATION']
        : null
    }
    ]
    if(values?.has_member === 'member-on') {
      paymentFields.shift()
    }
    return paymentFields    
  }



  const reviewFields = [
    [
      {
        icon: <InvoiceIcon />,
        title: t('REVIEW_PROCESS_TITLE'),
        field: [
          {
            reviewValue: t('NEW_MEMBER_SUMMARY_PROCESS')
          },
          {
            reviewValue: t('NEW_CONTRACT_SUMMARY_PROCESS')
          }
        ]
      },
      values?.new_member?.person_type == 'legal-person'
        ? legalReviewFields
        : physicalReviewFields
    ],
    [
      {
        icon: <PlaceMapIcon />,
        title: t('SUPPLY'),
        field: [
          {
            reviewLabel: t('CUPS_LABEL'),
            reviewValue: values?.cups,
            step: showReviewLinks
              ? formSteps['SUPPLY_POINT']
              : null
          },
          {
            reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_ADDRESS'),
            reviewValue: `${values?.supply_point_address?.street} ${values?.supply_point_address?.number}`,
            step: showReviewLinks
              ? formSteps['SUPPLY_INFO']
              : null
          },
          {
            reviewLabel: t('REVIEW_SUPPLY_POINT_LABEL_CITY'),
            reviewValue: values?.supply_point_address?.city?.name,
            step: showReviewLinks
              ? formSteps['SUPPLY_INFO']
              : null
          },
          {
            reviewLabel: 'CNAE:',
            reviewValue: values?.supply_point.cnae,
            step:
              showReviewLinks && values?.new_member?.person_type === 'legal-person'
                ? NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['SUPPLY_INFO']
                : null
          }
        ]
      },
      {
        icon: <ConfigIcon />,
        title: t('TECHNICAL_DATA_SUMMARY'),
        field: [
          {
            reviewLabel: t('TOLL_SUMMARY'),
            reviewValue: t('CURRENT')
          },
          {
            reviewLabel: t('FARE'),
            reviewValue: isTariffIndexed
              ? t('FARE_INDEXED')
              : values.contract.power_type === 'power-higher-15kw'
                ? t('FARE_PERIODS').concat(" ", '3.0TD')
                : t('FARE_PERIODS').concat(" ", '2.0TD')
          },
          {
            reviewLabel: t('POWER_SUMMARY'),
            reviewValue: t('CURRENT')
          },
          {
            reviewValue: t('REVIEW_TECHNICAL_DETAILS_FOOTER')
          }
        ]
      }
    ],
    [
      {
        icon: <PhoneIcon />,
        title: t('REVIEW_CONTACT_INFORMATION_TITLE'),
        field: [
          {
            reviewLabel: t('REVIEW_HOLDER_LABEL_PHONE'),
            reviewValue: `(${values?.new_member?.phone_code}) ${values?.new_member?.phone}`,
            step: showReviewLinks
              ? NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO']
              : null
          },
          {
            reviewLabel: t('REVIEW_HOLDER_LABEL_EMAIL'),
            reviewValue: values?.new_member?.email,
            step: showReviewLinks
              ? NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO']
              : null
          },
          {
            reviewLabel: t('LANGUAGE_SUMMARY'),
            reviewValue: languages[values?.new_member?.language],
            step: showReviewLinks
              ? NEW_MEMBER_CONTRACT_FORM_SUBSTEPS['MEMBER_INFO']
              : null
          }
        ]
      },
      {
        icon: <CreditCardIcon />,
        title: t('REVIEW_PAYMENT_DATA_TITLE'),
        field: getPaymentField()
      }
    ]
  ]

  const reviewPrices = [
    {
      title: t('REVIEW_PRICES_ENERGY_TITLE'),
      field: 'energia'
    },
    {
      title: t('GENERATION'),
      field: 'generation_kWh'
    },
    {
      title: t('REVIEW_PRICES_POWER_TITLE'),
      field: 'potencia'
    },
    { title: t('AUTOCONSUM'), field: 'energia_autoconsumida' }
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

    const cityId = values?.supply_point_address?.city?.id || null

    getPrices({
      tariff:
        values.contract.power_type === 'power-higher-15kw' ? '3.0TD' : '2.0TD',
      max_power: maxPower,
      vat : values.new_member ? values.new_member.nif : values.member.nif,
      cnae: values.supply_point.cnae,
      city_id: cityId
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
  }, [
    values.contract.power,
    values.contract.power_type,
    values.new_member.nif,
    values.supply_point.cnae,
    values?.supply_point_address?.city?.id
  ])

  const handleCheckboxChange = async (event, fieldName) => {
    let value = event.target.checked
    await setFieldValue(fieldName, value)
    setFieldTouched(fieldName, true)
  }

  return loading ? (
    <Loading />
  ) : (
    <Grid container spacing={4}>
      <Grid
        item
        xs={12}
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Typography variant="headline4">
          {t('MEMBER_PAGE_SUMMARY_QUESTION')}
        </Typography>
        {!showReviewLinks && (
          <Button
            id="edit_button"
            size="small"
            sx={{
              ...buttonGurbLight,
              minWidth: 'auto',
              width: 'auto',
              // padding: '6px 15px',
              fontSize: '0.90rem',
              textTransform: 'none'
              // height: 36
            }}
            startIcon={<EditOutlinedIcon fontSize="medium" />}
            onClick={() => setShowReviewLinks(true)}>
            {t('EDIT_DATA')}
          </Button>
        )}
      </Grid>
      <Grid item xs={12}>
        <ReviewTable tableFields={reviewFields} />
      </Grid>
      {!isTariffIndexed ? (
        <Grid item xs={12}>
          <ReviewPricesTable reviewPrices={reviewPrices} prices={prices} />
        </Grid>
      ) : (
        <Grid container spacing={0}>
          <Grid item xs={2} sm={1}>
            <PricetagIcon />
          </Grid>
          <Grid item xs={10} sm={11}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body.md.bold">
                  {t('REVIEW_PRICES_POWER_TITLE')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body.sm"
                  dangerouslySetInnerHTML={{
                    __html: t('REVIEW_PRICES_NOTICE_INDEXED', {
                      url: t('REVIEW_PRICES_NOTICE_INDEXED_URL')
                    })
                  }}></Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          {t('SUMMARY_OTHER_CONCEPTS_TITLE')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: t('SUMMARY_OTHER_CONCEPTS_BODY')
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.sm.regular">
          {t('PURPOSE')}
          <br />
          {t('RIGHTS')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="privacy_policy"
              checked={values?.privacy_policy_accepted || false}
              onChange={handleChangePrivacyPolicy}
            />
          }
          label={
            <span style={{ display: 'inline-block' }}>
              <label
                style={{ display: 'inline' }}
                dangerouslySetInnerHTML={{
                  __html: t('ACCEPT_PRIVACY_POLICY', {
                    url: t('ACCEPT_PRIVACY_POLICY_URL')
                  })
                }}
              />
              <span
                style={{
                  color: '#ff632b',
                  marginLeft: 2,
                  fontWeight: 'bold'
                }}>
                *
              </span>
            </span>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="generic_conditions_accepted"
              checked={values?.generic_conditions_accepted || false}
              onChange={(event) => {
                const checked = event.target.checked
                if (checked) {
                  setOpenGeneralTermsDialog(true)
                } else {
                  setFieldValue('generic_conditions_accepted', false)
                }
              }}
            />
          }
          label={
            <span style={{ display: 'inline-block' }}>
              <label
                style={{ display: 'inline' }}
                dangerouslySetInnerHTML={{
                  __html: t('NEW_GENERAL_TERMS', {
                    url: t('GENERAL_TERMS_URL')
                  })
                }}
              />
              <span
                style={{
                  color: '#ff632b',
                  marginLeft: 2,
                  fontWeight: 'bold'
                }}>
                *
              </span>
            </span>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TermsDialog
          title={
            <span>
              {t('CONTRACTUAL_PACKAGE')}
              <span
                style={{ color: '#ff632b', marginLeft: 4, fontWeight: 'bold' }}>
                *
              </span>
            </span>
          }
          open={openGeneralTermsDialog}
          onAccept={handleAcceptGeneralTerms}
          onClose={handleCloseGeneralTerms}
          maxWidth="sm">
          <LegalText
            documentName={
              isTariffIndexed
                ? 'general-and-indexed-specific-terms'
                : 'general-contract-terms'
            }
          />
        </TermsDialog>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="statutes"
              checked={values?.statutes_accepted || false}
              onChange={handleChangeStatutes}
            />
          }
          label={
            <span
              style={{
                position: 'relattiene que tener: ive',
                display: 'inline-block'
              }}>
              <label
                style={{ display: 'inline' }}
                dangerouslySetInnerHTML={{
                  __html: t('ACCEPT_STATUTES', {
                    url: t('ACCEPT_STATUTES_URL')
                  })
                }}
              />
              <span
                style={{
                  color: '#ff632b',
                  marginLeft: 2,
                  fontWeight: 'bold'
                }}>
                *
              </span>
            </span>
          }
        />
      </Grid>
      {values?.new_member?.person_type == 'legal-person' && (
        <Grid item xs={12}>
          <Typography variant="headline4">
            {t('SOM_SERVEIS_INFO_TITLE')}
          </Typography>
        </Grid>
      )}
      {values?.new_member?.person_type == 'legal-person' && (
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                data-cy="comercial_info_accepted"
                checked={values?.comercial_info_accepted}
                onChange={(event) => {
                  handleCheckboxChange(event, 'comercial_info_accepted')
                }}
              />
            }
            label={
              <label
                dangerouslySetInnerHTML={{
                  __html: t('SOM_SERVEIS_INF0_ACCEPTED')
                }}
              />
            }
          />
        </Grid>
      )}
    </Grid>
  )
}
export default NewContractMemberSummary
