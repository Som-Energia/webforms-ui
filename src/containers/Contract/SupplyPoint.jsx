import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import StepHeader from '../../components/StepHeader'
import StateCity from '../../components/StateCity'
import TermsDialog from '../../components/TermsDialog'
import Uploader from '../../components/Uploader'
import CnaeField from '../../components/CnaeField'

import { CNAE_HOUSING } from '../../services/utils'
import { getMunicipisByPostalCode } from '../../services/api'
import CadastralReferenceField from '../../components/CadastralReferenceField'

const CadastralReferenceHelperText = () => {
  const { t } = useTranslation()
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: t('HELP_CADASTRAL_REFERENCE', {
          url: t('HELP_CADASTRAL_REFERENCE_URL')
        })
      }}
    />
  )
}

// used in GURB
const SupplyPoint = (props) => {
  const { t } = useTranslation()

  const [addressValue, setAddressValue] = useState('')

  const {
    values,
    handleBlur,
    handleChange,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
  } = props
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
    isHousing
      ? onChangeCnae({ cnae: CNAE_HOUSING, valid: true, touched: true })
      : onChangeCnae({ cnae: '', valid: false, touched: false })
  }

  const onChangeCnae = ({ cnae, valid, touched = true }) => {
    setFieldTouched('supply_point.cnae', touched)
    setFieldValue('supply_point.cnae', cnae)
    setFieldValue('supply_point.cnae_valid', valid)
  }

  const onChangeCadastralReference = ({ value, valid, error }) => {
    setFieldValue('supply_point.cadastral_reference', value)
    setFieldValue('supply_point.cadastral_reference_error', error)
  }

  useEffect(() => {
    const setMunicipisWithPostalCode = async (postalCode) => {
      const municipis = await getMunicipisByPostalCode(postalCode)
      if (municipis.length > 0) {
        setFieldValue('supply_point.state', municipis[0][0]?.provincia)
        setFieldValue('supply_point.city', municipis[0][0]?.municipi)
      }
    }
    const postalCode = values?.supply_point?.postal_code
    if (postalCode.length > 4 && values?.supply_point?.city?.id === '') {
      setMunicipisWithPostalCode(postalCode)
    }
  }, [values?.supply_point?.postal_code])

  const handleAddressChange = (value) => {
    setAddressValue(value)
  }

  const handleLocationSelected = (selection) => {
    if (selection === null) {
      setFieldValue('supply_point.address', '')
      setFieldValue('supply_point.postal_code', '')
      setFieldValue('supply_point.number', '')
      setFieldValue('supply_point.lat', '')
      setFieldValue('supply_point.long', '')
      setFieldValue('supply_point.state', { id: '', name: '' })
      setFieldValue('supply_point.city', { id: '', name: '' })
    } else {
      const address = Object.assign(
        {},
        ...selection.address_components.map((x) => ({
          [x.types[0]]: x.long_name
        }))
      )

      setFieldValue('supply_point.address', address?.route)
      setFieldValue('supply_point.postal_code', address?.postal_code)
      setFieldValue('supply_point.number', address?.street_number || '')
      if (address?.street_number) {
        setFieldValue('supply_point.lat', selection?.geometry?.location?.lat())
        setFieldValue('supply_point.long', selection?.geometry?.location?.lng())
      }
    }
  }
  return (
    <>
      <StepHeader title={t('SUPPLY')} />
      <Typography
        variant="body1"
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
              error={
                errors?.supply_point?.address && touched?.supply_point?.address
              }
              helperText={
                touched?.supply_point?.address && errors?.supply_point?.address
              }
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
              error={
                errors?.supply_point?.number && touched?.supply_point?.number
              }
              helperText={
                touched?.supply_point?.number && errors?.supply_point?.number
              }
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
              error={
                errors?.supply_point?.floor && touched?.supply_point?.floor
              }
              helperText={
                touched?.supply_point?.floor && errors?.supply_point?.floor
              }
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
              helperText={
                touched?.supply_point?.door && errors?.supply_point?.door
              }
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
              error={
                errors?.supply_point?.postal_code &&
                touched?.supply_point?.postal_code
              }
              helperText={
                touched?.supply_point?.postal_code &&
                errors?.supply_point?.postal_code
              }
            />
          </Grid>

          <StateCity
            stateId="supply_point_state"
            stateName="supply_point.state"
            stateInitial={values?.supply_point?.state}
            stateError={
              errors?.supply_point?.state && touched?.supply_point?.state
            }
            cityId="supply_point_city"
            cityName="supply_point.city"
            cityInitial={values?.supply_point?.city}
            cityError={
              errors?.supply_point?.city && touched?.supply_point?.city
            }
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
              error={
                errors?.supply_point?.is_housing &&
                touched?.supply_point?.is_housing
              }
              helperText={
                touched?.supply_point?.is_housing &&
                errors?.supply_point?.is_housing
              }>
              <MenuItem value={true}>{t('YES')}</MenuItem>
              <MenuItem value={false}>{t('NO')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CnaeField
              name="supply_point.cnae"
              label={t('CNAE')}
              required
              disabled={!(values.supply_point.is_housing === false)}
              variant="outlined"
              id="supply_point_cnae"
              fullWidth
              value={values?.supply_point?.cnae}
              onChange={onChangeCnae}
              onBlur={handleBlur}
              error={
                errors?.supply_point?.cnae_valid && touched?.supply_point?.cnae
              }
              helperText={
                (touched?.supply_point?.cnae &&
                  errors?.supply_point?.cnae_valid) ||
                t('HELP_POPOVER_CNAE')
              }
            />
          </Grid>
          {props.isCadastralReference ? (
            <Grid item xs={6} sm={6}>
              <CadastralReferenceField
                id="supply_point_cadastral_reference"
                name="supply_point.cadastral_reference"
                label={t('CADASTRAL_REFERENCE')}
                variant="outlined"
                fullWidth
                value={values?.supply_point?.cadastral_reference}
                onChange={onChangeCadastralReference}
                onBlur={handleBlur}
                error={
                  values?.supply_point?.cadastral_reference &&
                  !!errors?.supply_point?.cadastral_reference
                }
                helperText={
                  values?.supply_point?.cadastral_reference &&
                  errors?.supply_point?.cadastral_reference ? (
                    errors?.supply_point?.cadastral_reference
                  ) : (
                    <CadastralReferenceHelperText />
                  )
                }
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sx={{ pt: 0 }}>
            {values?.contract?.has_service ? (
              <Typography>{t('ADJUNTAR_ULTIMA_FACTURA')}</Typography>
            ) : (
              <Typography>{t('ADJUNTAR_DOCUMENTACIO')}</Typography>
            )}
            <Box mt={1} mb={1}>
              <Uploader
                fieldError={
                  errors.supply_point?.attachments &&
                  touched.supply_point?.attachments &&
                  errors.supply_point?.attachments
                }
                callbackFn={(attachments) =>
                  setFieldValue('supply_point.attachments', attachments)
                }
                values={values.supply_point.attachments}
                maxFiles={values?.contract?.has_service ? 1 : 5}
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
        maxWidth="sm">
        <span
          dangerouslySetInnerHTML={{ __html: t('PRIVACY_POLICY_SUPLYPOINT') }}
        />
      </TermsDialog>
    </>
  )
}

export default SupplyPoint
