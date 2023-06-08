import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

import StepHeader from 'components/StepHeader'
import TermsDialog from 'components/TermsDialog'
import Loading from 'components/Loading'
import GeneralTerms from 'components/GeneralTerms'
import GeneralEspeciTerms from 'components/GeneralEspeciTerms'

import { languages, THOUSANDS_CONVERSION_FACTOR } from 'services/utils'
import { getPrices, getRates } from 'services/api'

const useStyles = makeStyles((theme) => ({
  withoutLabel: {
    marginTop: theme.spacing(1)
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 500,
    textTransform: 'uppercase',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.2)
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.8),
    '& .field__value': {
      flexGrow: 1
    }
  },
  label: {
    textTransform: 'uppercase',
    paddingRight: '12px',
    fontSize: '14px',
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.54)'
  },
  subsectionTitle: {
    marginTop: '1rem',
    textTransform: 'uppercase',
    fontSize: '14px',
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.54)'
  },
  value: {
    fontSize: '16px'
  },
  listItem: {
    paddingTop: '8px'
  },
  separatedField: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  separatedValues: {
    marginLeft: 0,
    marginRight: theme.spacing(1.6),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5)
  },
  divider: {
    marginTop: '12px',
    marginLeft: 0,
    marginRight: '32px'
  },
  dividerBottom: {
    marginTop: '24px',
    marginLeft: 0,
    marginRight: '32px'
  },
  prices: {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      paddingRight: '16px'
    }
  }
}))

const Review = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { values, setFieldValue, isIndexedContractEnabled } = props

  const [open, setOpen] = useState(false)
  const [prices, setPrices] = useState({})
  const [rates] = useState(getRates())
  const [loading, setLoading] = useState(true)

  const use_member_as_holder =
    values.holder.vat === values.member.vat && values.holder.isphisical
  const holder = use_member_as_holder ? values.member : values.holder

  useEffect(() => {
    setLoading(true)
    let powerFields = Object.values(
      Object.fromEntries(
        Object.entries(values.contract).filter(([key]) =>
          key.startsWith('power')
        )
      )
    )
    let maxPower = Math.max(...powerFields) * THOUSANDS_CONVERSION_FACTOR
    getPrices({
      tariff: values.contract.rate,
      max_power: maxPower,
      vat: holder.vat,
      cnae: values.supply_point.cnae,
      city_id: values.supply_point.city.id
    })
      .then((response) => {
        const tariffPrices = response?.data
        setPrices(tariffPrices)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error(error)
      })
  }, [])

  // TODO: terms_accepted -> general_contract_terms_accepted + indexed_specific_terms_accepted

  const handleParticularConditionsCheckClick = () => {
    setFieldValue(
      'particular_contract_terms_accepted',
      !values?.particular_contract_terms_accepted
    )
  }
  const handlePrivacyPolicyCheckClick = () => {
    setFieldValue('privacy_policy_accepted', !values?.privacy_policy_accepted)
  }
  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('terms_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('terms_accepted', false)
  }

  const ReviewField = ({ label, value, multipleValues = false }) => {
    return (
      <div
        className={clsx(
          classes.field,
          multipleValues && classes.separatedField
        )}
      >
        {label !== false && (
          <div className="field__title">
            <Typography className={classes.label} variant="subtitle2">
              {label}
            </Typography>
          </div>
        )}
        <div
          className={clsx(
            'field__value',
            multipleValues && classes.separatedValues
          )}
        >
          <Typography className={classes.value} variant="body2">
            {value}
          </Typography>
        </div>
      </div>
    )
  }

  const PowerValues = () => {
    return (
      <Grid container>
        {rates[values?.contract?.rate]?.num_power_periods > 1
          ? [...Array(rates[values?.contract?.rate]?.num_power_periods)].map(
              (value, index) => {
                const attr = index + 1 === 1 ? 'power' : `power${index + 1}`
                const label = values?.contract?.moreThan15Kw
                  ? `P${index + 1}`
                  : index === 0
                  ? t('PEAK')
                  : t('VALLEY')
                return (
                  <Grid
                    key={label}
                    item
                    xs={values?.contract?.moreThan15Kw? 4: 12}
                  >{`${label} ${values?.contract[attr]} kW `}</Grid>
                )
              }
            )
          : `${values?.contract?.power} kW`}
      </Grid>
    )
  }

  const Prices = ({ concept, name }) => {
    let keys = concept ? Object.keys(concept) : []
    keys.sort()
    const differentValues = (
      new Set(Object.keys(concept).map((key) => concept[key]?.value ))
    )
    if (differentValues.size === 1) {
      for (const key in concept) {
        return (
          <div className={classes.prices}>
            <span key={`${name}`}>
              {`${concept[key]?.value} ${concept[key]?.uom}`}
            </span>
          </div>
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
      <div className={classes.prices}>
        {concept ? (
          keys.map((key, index) => (
            <span key={`${name}:${key}`}>
              {`${labels[index]}: ${concept[key]?.value} ${concept[key]?.uom}`}
            </span>
          ))
        ) : (
          <>{t('UNAVAILABLE')}</>
        )}
      </div>
    )
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <StepHeader title={t('REVIEW_TITLE')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
      />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PROCESS')}
          </Typography>
          <ReviewField
            label={false}
            value={
              values?.contract?.has_service
                ? values?.holder?.previous_holder
                  ? t('CANVI_DE_COMERCIALITZADORA')
                  : t('CANVI_DE_COMERCIALITZADORA_I_TITULAR')
                : t('ALTA')
            }
          />
          <ReviewField
            label={t('RELATED_MEMBER')}
            value={values?.member?.vat}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">
            {t('HOLDER')}
          </Typography>
          <ReviewField label={'NIF'} value={values?.holder?.vat} />
          {values?.holder?.isphisical ? (
            values?.holder?.name && (
              <>
                <ReviewField
                  label={t('NAME')}
                  value={`${holder?.name} ${holder?.surname1} ${holder?.surname2}`}
                />
              </>
            )
          ) : (
            <>
              <ReviewField label={t('LEGAL_NAME')} value={holder?.name} />
              <ReviewField
                label={t('PROXY')}
                value={`${holder?.proxyname} (${holder?.proxynif})`}
              />
            </>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUPPLY')}
          </Typography>
          <ReviewField
            label={t('CUPS_LABEL')}
            value={values?.supply_point?.cups}
          />
          <ReviewField
            label={t('ADDRESS')}
            value={`${values?.supply_point?.address}, ${values?.supply_point?.number} ${values?.supply_point?.floor} ${values?.supply_point?.door}`}
          />
          <ReviewField
            label={t('CITY')}
            value={`${values?.supply_point?.city.name} (${values?.supply_point?.postal_code}) ${values?.supply_point?.state.name}`}
          />
          <ReviewField label={t('CNAE')} value={values?.supply_point?.cnae} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_TECHNICAL')}
          </Typography>
          {isIndexedContractEnabled === true ? (
            <>
              <ReviewField
                label={t('TOLL')}
                value={
                  values?.contract?.has_service
                    ? t('TOLL_SAME')
                    : values?.contract?.rate
                }
              />
              <ReviewField
                label={t('FARE')}
                value={
                  values?.contract?.isIndexed
                    ? t('FARE_INDEXED')
                    : t('FARE_PERIODS')
                }
              />
            </>
          ) : (
            <ReviewField
              label={t('FARE')}
              value={
                values?.contract?.has_service
                  ? t('FARE_SAME')
                  : values?.contract?.rate
              }
            />
          )}
          {values?.contract?.has_service ? (
            <ReviewField label={t('POWER')} value={t('POWER_SAME')} />
          ) : (
            <ReviewField label={t('POWER')} value={<PowerValues />} />
          )}
          <FormHelperText
            className={classes.withoutLabel}
            dangerouslySetInnerHTML={{ __html: t('FARE_POWER_CHANGE_NOTE') }}
          />
        </Grid>
        {values?.self_consumption?.have_installation === true && (
          <Grid item xs={12}>
            <Divider variant="middle" className={classes.divider} />
            <Typography className={classes.sectionTitle} variant="h6">
              {t('SELFCONSUMPTION_TITLE')}
            </Typography>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <ReviewField
                  label={t('CAU')}
                  value={values?.self_consumption?.cau}
                />
                <ReviewField
                  label={t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION')}
                  value={
                    values?.self_consumption?.collective_installation
                      ? t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_LABEL')
                      : t('SELFCONSUMPTION_INDIVIDUAL_INSTALLATION_LABEL')
                  }
                />
                <ReviewField
                  label={t('SELFCONSUMPTION_INSTALLPOWER')}
                  value={`${values?.self_consumption?.installation_power} kW`}
                />
                <ReviewField
                  label={t('SELFCONSUMPTION_AUXILIARY_SERVICE')}
                  value={
                    values?.self_consumption?.aux_services ? t('YES') : t('NO')
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReviewField
                  label={t('SELFCONSUMPTION_SITUATION')}
                  value={t(values?.self_consumption?.installation_type_title)}
                />
                <ReviewField
                  label={t('SELFCONSUMPTION_TECHNOLOGY')}
                  value={t(values?.self_consumption?.technology_title)}
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('CONTACT')}
          </Typography>
          {use_member_as_holder ? (
            <div dangerouslySetInnerHTML={{ __html: t('DATA_AS_IN_OV') }} />
          ) : (
            <>
              <ReviewField label={t('PHONE')} value={holder?.phone1} />
              <ReviewField label={t('EMAIL')} value={holder?.email} />
              <ReviewField
                label={t('LANGUAGE')}
                value={languages[holder?.language]}
              />
            </>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PAYMENT')}
          </Typography>
          <ReviewField label={t('IBAN')} value={values?.payment?.iban} />
          <ReviewField
            label={t('VOLUNTARY_CENT')}
            value={values?.payment?.voluntary_cent ? t('YES') : t('NO')}
          />
        </Grid>

        <Grid item xs={12}>
          {values?.contract?.isIndexed ? (
            <>
              <Divider variant="middle" className={classes.divider} />

              <Typography className={classes.sectionTitle} variant="h6">
                {t('PRICES')}
              </Typography>

              <Typography
                variant="body1"
                align="justify"
                dangerouslySetInnerHTML={{
                  __html: t('TARIFF_MODE_INDEXED_MORE', {
                    indexed_url: t('TARIFF_MODE_INDEXED_URL')
                  })
                }}
              />
            </>
          ) : (
            <>
              <Divider variant="middle" className={classes.divider} />

              <Typography className={classes.sectionTitle} variant="h6">
                {t('PRICES_PLUS_TAXES')}
              </Typography>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <ReviewField
                    label={t('TERME_ENERGIA')}
                    value={<Prices concept={prices?.te} name="te" />}
                    multipleValues={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ReviewField
                    label={t('GENERATION')}
                    value={<Prices concept={prices?.gkwh} name="gkwh" />}
                    multipleValues={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ReviewField
                    label={t('TERME_POTENCIA')}
                    value={<Prices concept={prices?.tp} name="tp" />}
                    multipleValues={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ReviewField
                    label={t('AUTOCONSUM')}
                    value={<Prices concept={prices?.ac} name="ac" />}
                    multipleValues={true}
                  />
                </Grid>
                {prices?.bo_social?.value ? (
                  <Grid item xs={12} sm={6}>
                    <ReviewField
                      label={t('BO_SOCIAL')}
                      value={`${prices?.bo_social?.value} ${prices?.bo_social?.uom}`}
                      multipleValues={true}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </>
          )}
          {values?.contract?.isIndexed ? null : (
            <Typography
              variant="body1"
              align="justify"
              dangerouslySetInnerHTML={{ __html: t('DESCRIPTION_MAJ_ALERT') }}
            />
          )}
          <Typography
            className={classes.subsectionTitle}
            variant="subtitle2"
            dangerouslySetInnerHTML={{ __html: t('CONCEPTES_EXTRES') }}
          />
          <ul>
            <li dangerouslySetInnerHTML={{ __html: t('EXTRA_REACTIVA') }}></li>
            <li
              dangerouslySetInnerHTML={{ __html: t('LLOGUER_COMPTADOR') }}
            ></li>
          </ul>

          <Divider variant="middle" className={classes.dividerBottom} />
        </Grid>
      </Grid>
      <TermsDialog
        title={t('GENERAL_TERMS')}
        open={open}
        onAccept={handleAccept}
        onClose={handleClose}
      >
        {values?.contract?.isIndexed ? (
          <GeneralEspeciTerms />
        ) : (
          <GeneralTerms />
        )}
      </TermsDialog>

      <Box mt={2}>
        <FormControlLabel
          control={
            <Checkbox
              name="terms_accepted"
              onClick={handleClick}
              checked={values.terms_accepted}
              color="primary"
            />
          }
          label={
            values?.contract?.isIndexed
              ? t('INDEXED_ACCEPT_CONDITIONS')
              : t('ACCEPT_TERMS')
          }
        />
      </Box>
      <Box mt={2}>
        <FormControlLabel
          control={
            <Checkbox
              name="particular_terms_accepted"
              onClick={handleParticularConditionsCheckClick}
              checked={values.particular_terms_accepted}
              color="primary"
            />
          }
          label={t('CONTRACT_PARTICULAR_TERMS')}
        />
      </Box>
      <Box mt={2}>
        <FormControlLabel
          control={
            <Checkbox
              name="privacy_policy_accepted"
              onClick={handlePrivacyPolicyCheckClick}
              checked={values.privacy_policy_accepted}
              color="primary"
            />
          }
          label={
            <Typography
              variant="body1"
              align="justify"
              dangerouslySetInnerHTML={{
                __html: t('CONTRACT_PRIVACY_POLICY_TERMS', {
                  url: t('CONTRACT_PRIVACY_POLICY_TERMS_URL')
                })
              }}
            ></Typography>
          }
        />
      </Box>
    </>
  )
}

export default Review
