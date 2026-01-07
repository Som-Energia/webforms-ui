import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

import { checkCups } from '../../services/api'
import StepHeader from '../../components/StepHeader'
import TermsDialog from '../../components/TermsDialog'

function CUPS(props) {
  const { t } = useTranslation()
  const {
    values,
    setValues,
    setFieldValue,
    handleChange,
    validateForm,
    handleBlur,
    errors,
    touched
  } = props

  const [isLoading, setIsLoading] = useState(false)
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

  const isActiveCups = () => {
    return values?.supply_point?.status === 'active'
  }

  const handleInputCups = (event) => {
    if (values.supply_point?.verified) {
      setFieldValue('supply_point.verified', false)
    }
    let value = event.target.value.match(/[0-9A-Za-z]{0,22}/)
    value = value[0].toUpperCase()
    setFieldValue('supply_point.cups', value, true)
  }

  useEffect(() => {
    const value = values.supply_point.cups
    if (value.length > 18) {
      setIsLoading(true)
      checkCups(value)
        .then((response) => {
          const status = response?.data?.status
          if (status === 'active') {
            const tmpValues = {
              ...values,
              supply_point: {
                ...values.supply_point,
                address: response?.data?.address,
                tariff_type: response?.data?.tariff_type,
              }
            }
            setValues(tmpValues)
          }
          setFieldValue('supply_point.status', status, true)          
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error.response)
          const errorStatus = error?.response?.data?.data?.status
            ? error?.response?.data?.data?.status
            : 'error'
          setFieldValue('supply_point.status', errorStatus)
          setIsLoading(false)
        })
    } else {
      setFieldValue('supply_point.status', 'error')
    }
  }, [values.supply_point.cups, setFieldValue, validateForm])

  const CupsHelperText = () => (
    <a href={t('CUPS_HELP_URL')} target="_blank" rel="noopener noreferrer">
      {t('CUPS_HELP')}
    </a>
  )

  return (
    <>
      <StepHeader title={t('CUPS_TITLE')} />
      <Box className="step-body">
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: t('FILL_CUPS') }}
        />
        <Box mt={3} mb={1}>
          <TextField
            id="cups"
            name="supply_point.cups"
            label={t('CUPS_LABEL')}
            variant="outlined"
            fullWidth
            required
            value={values?.supply_point?.cups}
            onChange={handleInputCups}
            onBlur={handleBlur}
            error={
              !isLoading &&
              errors?.supply_point?.cups &&
              touched?.supply_point?.cups
            }
            helperText={
              (!isLoading &&
                touched?.supply_point?.cups &&
                errors?.supply_point?.cups) || <CupsHelperText />
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading && <CircularProgress size={24} />}
                  {!isLoading && isActiveCups() && (
                    <CheckOutlinedIcon color="primary" />
                  )}
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box mt={3} mb={1}>
          <TextField
            id="cupsaddress"
            label={t('SUPPLY_POINT_ADDRESS')}
            variant="outlined"
            fullWidth
            disabled
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000',
              },
              '& .MuiInputLabel-root.Mui-disabled': {
                color: 'secondary.dark',
              }
            }}
            value={values?.supply_point?.address}
            helperText={t('CUPS_PARTIAL_ADDRESS_NOTICE')}
          />
        </Box>

        <Box mt={3} mb={0} mx={1}>
          <FormControlLabel
            disabled={!isActiveCups()}
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

        <Box mx={1} mt={0} mb={2}>
          <FormControlLabel
            disabled={!isActiveCups()}
            control={
              <Checkbox
                name="supply_point.verified"
                onChange={handleChange}
                checked={values?.supply_point?.verified}
                color="primary"
              />
            }
            label={t('CUPS_VERIFY_LABEL')}
          />
        </Box>
        <Box ml={1}>
          <FormHelperText
            dangerouslySetInnerHTML={{
              __html: t('CUPS_NO_VERIFY_HELP')
            }}></FormHelperText>
        </Box>
      </Box>
      <TermsDialog
        title={t('FAIR_TITLE')}
        open={open}
        onAccept={handleAccept}
        onClose={handleClose}
        maxWidth="sm">
        <Typography
          dangerouslySetInnerHTML={{ __html: t('PRIVACY_POLICY_SUPLYPOINT') }}
        />
      </TermsDialog>
    </>
  )
}

export default CUPS
