import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../../components/StepHeader'

import { languages, NEW_MEMBER_CONTRIB_AMOUNT } from '../../../services/utils'

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
    marginBottom: theme.spacing(0.8)
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
  boxContent: {
    marginTop: '24px',
    marginBottom: '10px',
    textAlign: 'justify'
  }
}))

const Review = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { values, setFieldValue, isValid } = props
  console.log("IS VALID",isValid)
  console.log("values", values.privacy_policy_accepted)

  const handleClickPrivacyPolicy = (event) => {
    event.preventDefault()
    setFieldValue('privacy_policy_accepted', !values?.privacy_policy_accepted)
  }

  const ReviewField = useCallback(({ label, value }) => {
    return (
      <div className={classes.field}>
        <div className="field__title">
          <Typography className={classes.label} variant="subtitle2">
            {label}
          </Typography>
        </div>
        <div className="field__value">
          <Typography className={classes.value} variant="body2">
            {value}
          </Typography>
        </div>
      </div>
    )
  },[classes])

  return (
    <>
      <StepHeader title={t('FORMULARIO DE PARTICIPACIÓN GENERATION KWH - trans')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('<p>Gairebé hem acabat!</p><p>Revisa les dades introduïdes, accepta les clàusules legals i ja podràs signar el contracte i el permís per girar el rebut bancari de la teva inscripció al Generation kWh. - trans</p>')}}
      />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">
            {t(
              values?.member?.is_member ? 'REVIEW_PERSONAL_DATA' : 'NEW_MEMBER'
            )}
          </Typography>
          <ReviewField label={'NIF'} value={values?.member?.vat} />

          {values?.member?.is_member && (
            <>
              <ReviewField
                label={t('NUMERO_SOCI')}
                value={`${values?.member?.number}`}
              />
            </>
          )}

          {!values?.member?.is_member && (
            <>
              {values?.member?.isphisical ? (
                <>
                  <ReviewField
                    label={t('NAME')}
                    value={`${values?.member?.name} ${values?.member?.surname1} ${values?.member?.surname2}`}
                  />
                </>
              ) : (
                <>
                  <ReviewField
                    label={t('LEGAL_NAME')}
                    value={values?.member?.name}
                  />
                  <ReviewField
                    label={t('PROXY')}
                    value={`${values?.member.proxyname} (${values?.member?.proxynif})`}
                  />
                </>
              )}
              <ReviewField
                label={t('ADDRESS')}
                value={`${values?.member?.address}, ${values?.member?.number} ${
                  values?.member?.floor || ''
                } ${values?.member?.door || ''}`}
              />
              <ReviewField
                label={t('CITY')}
                value={`${values?.member?.city.name} (${values?.member?.postal_code}) ${values?.member?.state.name}`}
              />
            </>
          )}
        </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.sectionTitle} variant="h6">
              {t('CONTACT')}
            </Typography>
            { values?.member?.is_member
              ? <div dangerouslySetInnerHTML={{ __html: t('DATA_AS_IN_OV') }}/>
              : ( <>
                <ReviewField label={t('PHONE')} value={values?.member?.phone1} />
                <ReviewField label={t('EMAIL')} value={values?.member?.email} />
                <ReviewField
                  label={t('LANGUAGE')}
                  value={languages[values?.member?.language]}
                />
              </>)
            }
          </Grid>
        <Grid item xs={12} sm={12}>
          <Divider variant="middle" className={classes.divider} />
          <Typography className={classes.sectionTitle} variant="h6">
            {t('SUMMARY_GROUP_PAYMENT')}
          </Typography>
          <ReviewField
            label={t('CONTRIBUTION_AMOUNT')}
            value={`${new Intl.NumberFormat('ca').format(
              values?.payment?.amount
            )} €`}
          />
          {!values?.member?.is_member && (
            <>
              <ReviewField
                label={t('CONTRIBUTION_NEW_MEMBER_CONTRIB')}
                value={`${new Intl.NumberFormat('ca').format(
                  NEW_MEMBER_CONTRIB_AMOUNT
                )} €`}
              />
              <ReviewField
                label={t('CONTRIBUTION_TOTAL_AMOUNT')}
                value={`${new Intl.NumberFormat('ca').format(
                  parseInt(NEW_MEMBER_CONTRIB_AMOUNT) +
                    parseInt(values?.payment?.amount)
                )} €`}
              />
            </>
          )}

          <ReviewField label={t('IBAN')} value={values?.payment?.iban} />

          <Divider variant="middle" className={classes.dividerBottom} />
        </Grid>
      </Grid>

      <Box className={classes.boxContent}>
        <Typography 
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('<strong>RESPONSABLE:</strong> SOM ENERGIA, SCCL. (F55091367), Pic de Peguera, 11, 17003 de Girona, <a href=\'mailto:somenergia@delegado-datos.com\'>somenergia@delegado-datos.com</a>. <strong>FINALITAT:</strong> Gestionar i tramitar la contractació del servei Generation kWh; gestionar la facturació dels consums segons la tarifa Generation kWh; tramitar l\'assignació de la tarifa Generation kWh als tercers designats pel client. <strong>LEGITIMACIÓ:</strong> Relació contractual. <strong>CESSIONS:</strong> No estan previstes cessions, excepte les legalment previstes. <strong>CONSERVACIÓ:</strong> Fins a la vigència del contracte de subministrament i, durant els terminis exigits per llei per a atendre eventuals responsabilitats. <strong>DRETS:</strong> Pot exercir el seu dret d\'accés, rectificació, supressió, portabilitat, limitació i oposició dirigint-se a les dades de la persona responsable. En cas de divergències, pot presentar una reclamació davant l\'Agència de Protecció de Dades (www.aepd.es). <strong>IMPORTANT:</strong> Declaro responsablement que disposo del consentiment de les terceres persones a les quals assignaré la tarifa Generation kWh, per a cedir les seves dades personals a SOM ENERGIA necessaris per a l\'assignació i contractació de la tarifa Generation kWh.')}}
        />
      </Box>

      <Box mt={2} mb={1} className={classes.boxContent}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values?.privacy_policy_accepted}
              onClick={handleClickPrivacyPolicy}
              color="primary"
              value={true}
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('<strong>Acepto la política de privacidad y la declaración responsable.</strong>')
              }}
            />
          }
        />
      </Box>

      <Box className={classes.boxContent}>
        <Typography 
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('<p>Tingues en compte que la signatura del contracte implica l’acceptació de les condicions contractuals i, per tant, el càrrec de l’import del préstec al compte bancari que has indicat.</p><p>Quan acabis la signatura dels documents, t’enviarem per correu electrònic les Condicions generals i les Condicions particulars del teu contracte de préstec al Generation kWh perquè en tinguis una còpia. </p><p>Moltes gràcies pel teu suport al canvi de model energètic!</p>')}}
        />
      </Box>
    </>
  )
}

export default Review
