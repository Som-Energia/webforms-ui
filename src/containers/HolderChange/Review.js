import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import StepHeader from '../../components/StepHeader'

const generalTerms = `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam congue lacus non luctus iaculis. Etiam eu nibh sed risus tempor sagittis vitae vel erat. In id dictum magna, nec eleifend ex. Vivamus pharetra lacinia urna, quis malesuada nulla feugiat quis. Sed eget aliquet quam. Nulla facilisi. Duis quis orci augue. Nunc vitae viverra urna. In sit amet justo purus. Quisque ipsum lacus, malesuada ut nulla id, viverra venenatis lorem. Mauris justo orci, tempus ut massa eget, imperdiet lobortis ex. Donec ac tortor ullamcorper, fermentum ante non, congue elit. Donec finibus vitae quam non aliquam.</p>

<p><b>David</b> Praesent nec egestas ligula. Ut convallis consequat risus ut ullamcorper. In nec erat sodales, tempus nibh sit amet, suscipit ex. Ut dignissim sollicitudin leo, in aliquet tortor varius in. Ut rhoncus risus imperdiet gravida lacinia. In hac habitasse platea dictumst. Donec condimentum sapien sit amet odio ultricies, et vulputate nisi rhoncus. In iaculis enim id nibh dictum, a euismod purus luctus. Sed venenatis dolor sed dui dictum viverra. Maecenas libero est, vehicula non ullamcorper vel, finibus ac lorem.</p>

<p>Maecenas tristique odio vel dictum pharetra. Pellentesque posuere porttitor augue sit amet pulvinar. Sed in diam elit. Nullam quis tristique lacus. Aenean porta rhoncus scelerisque. Fusce sed justo in leo interdum laoreet. Sed convallis ligula eu metus cursus, vitae pulvinar est venenatis.</p>

In vel lacus arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque ullamcorper vitae tellus faucibus suscipit. Fusce at dui condimentum, pellentesque eros at, lacinia dui. Ut lorem mauris, vehicula id dignissim a, scelerisque id nisi. Nunc ut elementum metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Maecenas elementum et nibh a lacinia. Nam elementum metus dignissim sollicitudin finibus. Pellentesque ut odio justo. Nulla vel tincidunt dolor. Mauris nec urna sagittis, finibus tellus nec, gravida nisl. Mauris quis nisi ut nunc eleifend iaculis. Aliquam tempor quis libero et luctus. Suspendisse augue risus, sodales vitae ligula id, pretium volutpat nibh. Phasellus ultricies nunc nisl, in congue ante bibendum sit amet. Maecenas consectetur nisl massa, nec mollis justo convallis vel. Maecenas dictum at quam a ornare. Fusce sit amet euismod tellus. Vivamus tempus fermentum aliquam.
`

const useStyles = makeStyles((theme) => ({
  withoutLabel: {
    marginTop: theme.spacing(1)
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 400,
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
  }
}))

const Review = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { values, setFieldValue } = props

  const [open, setOpen] = useState(false)
  const descriptionElementRef = useRef(null)

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

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const ReviewField = ({ label, value }) => {
    return (
      <div className={classes.field}>
        <div className="field__title">
          <Typography className={classes.label} variant="subtitle2">{label}</Typography>
        </div>
        <div className="field__value">
          <Typography className={classes.value} variant="body2">{value}</Typography>
        </div>
      </div>
    )
  }

  return (
    <>
      <StepHeader title={t('REVIEW_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('REVIEW_DESCRIPTION') }}
      />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('SUMMARY_GROUP_PROCESS')}</Typography>
          <ReviewField label={t('PROCESS_TYPE')} value={t('PROCESS_TYPE_HOLDER_CHANGE')} />
          <ReviewField label={t('RELATED_MEMBER')} value={ values?.member?.become_member ? (`${values?.holder?.name} ${values?.holder?.surname1} ${values?.holder?.surname2}`) : t('RELATED_MEMBER_PENDING')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('SUPPLY')}</Typography>
          <ReviewField label={t('CUPS_LABEL')} value={values?.supply_point?.cups} />
          <ReviewField label={t('ADDRESS')} value={values?.supply_point?.address} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('HOLDER')}</Typography>
          <ReviewField label={'NIF'} value={values?.holder?.vat} />
          { values?.holder?.isphisical
            ? <>
              <ReviewField label={t('NAME')} value={`${values?.holder?.name} ${values?.holder?.surname1} ${values?.holder?.surname2}`} />
            </>
            : <>
              <ReviewField label={t('LEGAL_NAME')} value={values?.holder?.name} />
              <ReviewField label={t('PROXY')} value={`${values?.holder.proxyname}(${values?.holder?.proxyvat})`} />
            </>
          }
          <ReviewField label={t('ADDRESS')} value={values?.holder?.address} />
          <ReviewField label={t('CITY')} value={`${values?.holder?.city.name} (${values?.holder?.postal_code}) ${values?.holder?.state.name}`} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('CONTACT')}</Typography>
          <ReviewField label={t('PHONE')} value={values?.holder?.phone1} />
          <ReviewField label={t('EMAIL')} value={values?.holder?.email} />
          <ReviewField label={t('LANGUAGE')} value={values?.holder?.language?.name} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('SUMMARY_GROUP_TECHNICAL')}</Typography>
          <ReviewField label={t('FARE')} value={t('FARE_SAME')} />
          <ReviewField label={t('POWER')} value={t('POWER_SAME')} />
          <FormHelperText className={classes.withoutLabel} dangerouslySetInnerHTML={{ __html: t('FARE_POWER_CHANGE_NOTE') }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className={classes.sectionTitle} variant="h6">{t('SUMMARY_GROUP_PAYMENT')}</Typography>
          <ReviewField label={t('IBAN')} value={values?.payment?.iban} />
          <ReviewField label={t('VOLUNTARY_CENT')} value={values?.payment?.voluntary_cent ? t('YES') : t('NO')} />
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{t('GENERAL_TERMS')}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            dangerouslySetInnerHTML={{ __html: generalTerms }}
          >
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {t('I_DECLINE')}
          </Button>
          <Button onClick={handleAccept} variant="contained" color="primary">
            {t('I_ACCEPT')}
          </Button>
        </DialogActions>
      </Dialog>
      <Box mt={3}>
        <FormControlLabel
          control={
            <Checkbox
              onClick={handleClick}
              checked={values.terms_accepted}
              color="primary"
            />
          }
          label={t('ACCEPT_TERMS')}
        />
      </Box>
    </>
  )
}

export default Review
