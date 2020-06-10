import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import { checkCups } from '../../services/api'
import StepHeader from '../../components/StepHeader'

function CUPS (props) {
  const { t } = useTranslation()
  const { values, setFieldValue, validateForm, handleChange, handleBlur, errors, touched } = props

  const [isLoading, setIsLoading] = useState(false)

  const isActiveCups = () => {
    return values?.supply_point?.status === 'active'
  }

  useEffect(() => {
    const value = values.supply_point.cups
    if (value.length > 18) {
      setIsLoading(true)
      checkCups(value)
        .then(response => {
          const status = response?.data?.status
          setFieldValue('supply_point.status', status)
          if (status === 'active') {
            setFieldValue('supply_point.address', response?.data?.address)
          }
          validateForm()
          setIsLoading(false)
        })
        .catch(error => {
          console.log(error.response)
          const errorStatus = error?.response?.data?.data?.status
            ? error?.response?.data?.data?.status
            : 'error'
          setFieldValue('supply_point.status', errorStatus)
          validateForm()
          setIsLoading(false)
        })
    } else {
      setFieldValue('supply_point.status', false)
    }
  }, [values.supply_point.cups, setFieldValue, validateForm])

  const CupsHelperText = () => (
    <a
      href={t('CUPS_HELP_URL')}
      target="_blank"
      rel="noopener noreferrer"
    >
      {t('CUPS_HELP')}
    </a>
  )

  return (
    <>
      <StepHeader title={t('CUPS_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('FILL_CUPS') }}
      />
      <Box mt={3} mb={1}>
        <TextField
          id="cups"
          name="supply_point.cups"
          label={t('CUPS_LABEL')}
          variant="outlined"
          fullWidth
          autoFocus
          required
          value={values?.supply_point?.cups}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.supply_point?.cups && touched?.supply_point?.cups}
          helperText={(touched?.supply_point?.cups && errors?.supply_point?.cups) || <CupsHelperText />}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                { isLoading &&
                  <CircularProgress size={24} />
                }
                { !isLoading && isActiveCups() &&
                  <CheckOutlinedIcon color="primary" />
                }
              </InputAdornment>
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
          value={values?.supply_point?.address}
          helperText={t('CUPS_PARTIAL_ADDRESS_NOTICE')}
        />
      </Box>
      <Box ml={1} mt={4} mb={1}>
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
        <FormHelperText dangerouslySetInnerHTML={{ __html: t('CUPS_NO_VERIFY_HELP') }}></FormHelperText>
      </Box>
    </>
  )
}

export default CUPS
