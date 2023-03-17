import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

import Header from 'components/oficinavirtual/Header'
import TermsDialog from 'components/TermsDialog'
import GeneralTerms from 'components/GeneralTerms'

import { languages, THOUSANDS_CONVERSION_FACTOR } from 'services/utils'
import { getPrices, getRates } from 'services/api'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    padding: '24px'
  },
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
    marginTop: '10px',
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


const PowerValues = ({rates,values}) => {
  const {t} = useTranslation()
  return (
    <Grid container>
      {rates[values?.contract?.rate]?.num_power_periods > 1
        ? [...Array(rates[values?.contract?.rate]?.num_power_periods)].map(
            (value, index) => {
              const attr = index + 1 === 1 ? 'power' : `power${index + 1}`
              const label = values?.contract?.moreThan15Kw
                ? `P${index + 1}`
                : index === 0
                ? t('PUNTA')
                : t('VALLE')
              return (
                <Grid
                  key={label}
                  item
                  xs={4}>{`${label} ${values?.contract[attr]} kW `}</Grid>
              )
            }
          )
        : `${values?.contract?.power} kW`}
    </Grid>
  )
}

const ReviewField = ({ label, value, multipleValues = false }) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(
        classes.field,
        multipleValues && classes.separatedField
      )}>
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
        )}>
        <Typography className={classes.value} variant="body2">
          {value}
        </Typography>
      </div>
    </div>
  )
}




const IndexadaReview = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  
  let { setFieldValue, contractValues } = props
  const powers = JSON.parse(contractValues.powers)
console.log(contractValues)
  const [open, setOpen] = useState(false)
  const [IndexadaTermsAccepted, setIndexadaTermsAccepted] = useState(false)

  //const use_member_as_holder = values.holder.vat === values.member.vat && values.holder.isphisical
  //const holder = use_member_as_holder ? values.member : values.holder

  const use_member_as_holder = false

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

  const handleIndexadaTermsAccepted = (data) => {
    setIndexadaTermsAccepted(data)
    setFieldValue('indexada_terms_accepted', data)
  }

  return (
    <>
      <Header>{t('REVIEW_TITLE')}</Header>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PROCESS')}
          </Typography>
          <ReviewField
            value={t('Modificació de tarifa comercialitzadora')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUPPLY')}
          </Typography>
          <ReviewField
            label={t('CUPS_LABEL')}
            value={contractValues?.cups}
          />
          <ReviewField
            label={t('ADDRESS')}
            value={contractValues?.address}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">
            {t('HOLDER')}
          </Typography>
          <ReviewField label={'NIF'} value={contractValues?.owner_vat} />
          {contractValues?.isphisical ? (
            contractValues?.owner_vat && (
              <>
                <ReviewField
                  label={t('NAME')}
                  value={contractValues?.owner_name}
                />
              </>
            )
          ) : (
            <>
              <ReviewField label={t('LEGAL_NAME')} value={contractValues?.name} />
              <ReviewField
                label={t('PROXY')}
                value={`${contractValues?.proxyname} (${contractValues?.proxynif})`}
              />
            </>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('CONTACT')} 
          </Typography>
          {use_member_as_holder ? (
            <div dangerouslySetInnerHTML={{ __html: t('DATA_AS_IN_OV') }} />
          ) : (
            <>
              <ReviewField label={t('PHONE')} value={contractValues?.owner_phone} />
              <ReviewField label={t('EMAIL')} value={contractValues?.owner_email} />
              <ReviewField
                label={t('LANGUAGE')}
                value={contractValues?.language}
              />
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_TECHNICAL')}
          </Typography>
          <ReviewField
            label={t('FARE')}
            value={contractValues?.tariff}
          />
          <ReviewField label={t('POWER_PUNTA')} value={powers[0].power} />
          <ReviewField label={t('POWER_VALLE')} value={powers[1].power} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Divider variant="middle" className={classes.divider} />

          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PAYMENT')}
          </Typography>
          <ReviewField label={t('IBAN')} value={contractValues?.iban} />
          <ReviewField
            label={t('VOLUNTARY_CENT')}
            value={contractValues?.payment?.voluntary_cent ? t('YES') : t('NO')}
          />
        </Grid>

        <Grid item xs={12}>
          <FormHelperText
            className={classes.withoutLabel}
            dangerouslySetInnerHTML={{
              __html: t(
                'En cas que vulguis corregir les dades que ens has indicat en aquest procés, ho pots fer contactant amb nosaltres al correu: modifica@somenergia.coop.'
              )
            }}
          />
        </Grid>
      </Grid>
      <Grid container className={classes.root}>
        <TermsDialog
          title={t('GENERAL_TERMS')}
          open={open}
          onAccept={handleAccept}
          onClose={handleClose}>
          <GeneralTerms />
        </TermsDialog>

        <Grid xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="terms_accepted"
                onClick={handleClick}
                checked={contractValues.terms_accepted}
                color="primary"
              />
            }
            label={t('ACCEPT_TERMS')}
          />
        </Grid>
        <Grid xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="indexada_terms_accepted"
                onClick={() => handleIndexadaTermsAccepted(!IndexadaTermsAccepted)}
                checked={contractValues.indexada_terms_accepted}
                color="primary"
              />
            }
            label={t('INDEXADA_ACCEPT_TERMS')}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default IndexadaReview
