import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import StateCity from '../../components/StateCity'
import TermsDialog from '../../components/TermsDialog'
import Uploader from '../../components/Uploader'

import { CNAE_HOUSING } from '../../services/utils'

const useStyles = makeStyles((theme) => ({
  memberChecked: {
    fontWeight: 500,
    color: theme.palette.primary.main
  },
  noPaddingTop: {
    paddingTop: '0 !important'
  }
}))

const CnaeHelperText = () => {
  const { t } = useTranslation()
  return <span dangerouslySetInnerHTML={{ __html: t('HELP_POPOVER_CNAE') }} />
}

const SupplyPoint = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const { values, handleBlur, handleChange, errors, touched, setFieldValue } = props
  const [open, setOpen] = useState(false)

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('supply_point.supply_point_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('supply_point.supply_point_accepted', false)
  }

  const onChangeStateCity = ({ state, city }) => {
    setFieldValue('supply_point.state', state, false)
    setFieldValue('supply_point.city', city)
  }

  const handleIsHousing = (event) => {
    event.preventDefault()
    const isHousing = event.target.value
    setFieldValue('supply_point.is_housing', event.target.value, false)
    isHousing ? setFieldValue('supply_point.cnae', CNAE_HOUSING, true) : setFieldValue('supply_point.cnae', '', true)
    // validateForm()
  }

  return (
    <>
      <StepHeader title={t('SUPPLY')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('FILL_SUPPLY_POINT') }}
      />
      <Box mt={3} mb={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TextField
              id="supply_point_address"
              name="supply_point.address"
              label={t('HOLDER_ADDRESS')}
              required
              variant="outlined"
              fullWidth
              value={values?.supply_point?.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.supply_point?.address && touched?.supply_point?.address}
              helperText={(touched?.supply_point?.address && errors?.supply_point?.address)}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <TextField
              id="supply_point_number"
              name="supply_point.number"
              label={t('NUMBER')}
              required
              variant="outlined"
              fullWidth
              value={values?.supply_point?.number}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.supply_point?.number && touched?.supply_point?.number}
              helperText={(touched?.supply_point?.number && errors?.supply_point?.number)}
            />
          </Grid>

          <Grid item xs={4} sm={2}>
            <TextField
              id="supply_point_floor"
              name="supply_point.floor"
              label={t('FLOOR')}
              variant="outlined"
              fullWidth
              value={values?.supply_point?.floor}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.supply_point?.floor && touched?.supply_point?.floor}
              helperText={(touched?.supply_point?.floor && errors?.supply_point?.floor)}
            />
          </Grid>

          <Grid item xs={4} sm={2}>
            <TextField
              id="supply_point_door"
              name="supply_point.door"
              label={t('DOOR')}
              variant="outlined"
              fullWidth
              value={values?.supply_point?.door}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.supply_point?.door && touched?.supply_point?.door}
              helperText={(touched?.supply_point?.door && errors?.supply_point?.door)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="supply_point_postal_code"
              name="supply_point.postal_code"
              label={t('HOLDER_POSTALCODE')}
              variant="outlined"
              required
              fullWidth
              value={values?.supply_point?.postal_code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.supply_point?.postal_code && touched?.supply_point?.postal_code}
              helperText={touched?.supply_point?.postal_code && errors?.supply_point?.postal_code}
            />
          </Grid>

          <StateCity
            stateId="supply_point_state"
            stateName="supply_point.state"
            stateInitial={values?.supply_point?.state}
            stateError={errors?.supply_point?.state && touched?.supply_point?.state}
            stateHelperText={touched?.supply_point?.state && errors?.supply_point?.state}
            cityId="supply_point_city"
            cityName="supply_point.city"
            cityInitial={values?.supply_point?.city}
            cityError={errors?.supply_point?.city && touched?.supply_point?.city}
            cityHelperText={touched?.supply_point?.city && errors?.supply_point?.city}
            onChange={onChangeStateCity}
          />

          <Grid item xs={12} sm={6}>
            <TextField
              select
              id="supply_point_is_housing"
              name="supply_point.is_housing"
              label={t('ES_UN_HABITATGE')}
              required
              variant="outlined"
              fullWidth
              value={values?.supply_point?.is_housing}
              onChange={handleIsHousing}
              onBlur={handleBlur}
              error={errors?.supply_point?.is_housing && touched?.supply_point?.is_housing}
              helperText={touched?.supply_point?.is_housing && errors?.supply_point?.is_housing}
            >
              <MenuItem value={true}>{t('YES')}</MenuItem>
              <MenuItem value={false}>{t('NO')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="supply_point_cnae"
              name="supply_point.cnae"
              label={t('CNAE')}
              required
              disabled={!(values.supply_point.is_housing === false)}
              variant="outlined"
              fullWidth
              value={values?.supply_point?.cnae}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.supply_point?.cnae && touched?.supply_point?.cnae}
              helperText={(touched?.supply_point?.cnae && errors?.supply_point?.cnae) || <CnaeHelperText />}
            />
          </Grid>
          <Grid item xs={12} className={classes.noPaddingTop}>
            <Typography>
              {t('ADJUNTAR_ULTIMA_FACTURA')}
            </Typography>
            <Box mt={1} mb={1}>
              <Uploader
                fieldError={errors.supply_point?.attachments && touched.supply_point?.attachments && errors.supply_point?.attachments}
                callbackFn={attachments => setFieldValue('supply_point.attachments', attachments)}
                values={values.supply_point.attachments}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box mt={1} mb={2}>
        <FormControlLabel
          control={
            <Checkbox
              id="supply_point_accepted"
              color="primary"
              name="supply_point_accepted"
              onClick={handleClick}
              checked={values?.supply_point?.supply_point_accepted}
              value={true}
            />
          }
          label={t('FAIR_TITLE_LABEL')}
        />
      </Box>

      <TermsDialog
        title={t('FAIR_TITLE')}
        open={open}
        onAccept={handleAccept}
        onClose={handleClose}
        maxWidth="sm"
      >
        <span dangerouslySetInnerHTML={{ __html: t('PRIVACY_POLICY_SUPLYPOINT') }} />
      </TermsDialog>
    </>
  )
}

export default SupplyPoint
