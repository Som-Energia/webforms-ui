import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import { checkCups } from '../../services/api'

const CupsHelperText = () => {
  const { t } = useTranslation()
  return (
    <a href={t('CUPS_HELP_URL')} target="_blank" rel="noopener noreferrer">
      {t('CUPS_HELP')}
    </a>
  )
}

const CUPS = (props) => {
  const { t } = useTranslation()

  const {
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = props
  const [isLoading, setLoading] = useState(false)

  const handleInputCups = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,22}/)
    value = value[0].toUpperCase()
    setFieldValue('supply_point.cups', value, true)
  }

  const handleChangeService = ({ option }) => {
    setFieldValue(
      'contract',
      {
        rate: '',
        power: '',
        power2: '',
        power3: '',
        fare: '',
        phases: '',
        moreThan15Kw: false
      },
      false
    )
    option === false
      ? setFieldValue('holder.previous_holder', false, false)
      : setFieldValue('holder.previous_holder', '', false)
    setFieldValue('contract.has_service', option)
  }

  useEffect(() => {
    const value = values.supply_point.cups
    if (value.length > 18) {
      setLoading(true)
      checkCups(value)
        .then((response) => {
          const status = response?.data?.status
          setFieldValue('supply_point.status', status)
          setLoading(false)
        })
        .catch((error) => {
          console.error(error.response)
          const errorStatus = error?.response?.data?.data?.status
            ? error?.response?.data?.data?.status
            : 'error'
          setFieldValue('supply_point.status', errorStatus)
          setLoading(false)
        })
    } else {
      setFieldValue('supply_point.status', 'error')
    }
  }, [values.supply_point.cups, setFieldValue])

  return (
    <>
      <StepHeader title={t('CUPS_TITLE')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('FILL_CUPS') }}
      />
      <Box mt={1} mb={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="cups"
              name="supply_point.cups"
              label={t('CUPS')}
              onChange={handleInputCups}
              onBlur={handleBlur}
              value={values.supply_point.cups}
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoading && <CircularProgress size={24} />}
                    {!isLoading &&
                      (values?.supply_point?.status === 'new' ||
                        values?.supply_point?.status === 'inactive') && (
                        <CheckOutlinedIcon color="primary" />
                      )}
                  </InputAdornment>
                )
              }}
              error={errors?.supply_point?.cups && touched?.supply_point?.cups}
              helperText={
                (touched?.supply_point?.cups && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: errors?.supply_point?.cups
                    }}
                  />
                )) || <CupsHelperText />
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Box mt={1} mb={2} sx={{
        '& h6': {
          fontSize: '1rem',
          fontWeight: 500,
          mt: 2
        }
      }} >
        <Chooser
          question={t('HI_HA_LLUM_AL_PUNT_DE_SUBMINISTRAMENT')}
          onChange={handleChangeService}
          value={values.contract.has_service}
          disabled={
            values.supply_point.status !== 'new' &&
            values.supply_point.status !== 'inactive'
          }
          options={[
            {
              id: 'change-comer',
              value: true,
              label: t('AVIS_CANVI_COMERCIALITZADORA_LABEL'),
              description: t('AVIS_CANVI_COMERCIALITZADORA_DESC')
            },
            {
              id: 'register-service',
              value: false,
              label: t('AVIS_ALTA_DE_SERVEI_LABEL'),
              description: t('AVIS_ALTA_DE_SERVEI_DESC')
            }
          ]}
        />
      </Box>
    </>
  )
}

export default CUPS
