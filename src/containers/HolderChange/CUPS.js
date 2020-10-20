import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import { checkCups } from '../../services/api'
import StepHeader from '../../components/StepHeader'

function CUPS (props) {
  const { t } = useTranslation()
  const { values, setFieldValue, setTouched, handleChange, validateForm, handleBlur, errors, touched } = props

  const [isLoading, setIsLoading] = useState(false)

  const isActiveCups = () => {
    return values?.supply_point?.status === 'active'
  }

  const handleClick = (event) => {
    const supply_point_accepted = values?.supply_point?.supply_point_accepted
    setFieldValue('supply_point.supply_point_accepted', !supply_point_accepted)
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
        .then(response => {
          const status = response?.data?.status
          if (status === 'active') {
            setFieldValue('supply_point.address', response?.data?.address, false)
          }
          setTouched({ supply_point: { cups: true } }, false)
          setFieldValue('supply_point.status', status, true)
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
      setFieldValue('supply_point.status', 'error')
    }
  }, [values.supply_point.cups, setFieldValue, validateForm, setTouched])

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
          onChange={handleInputCups}
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

      <Box ml={1} mt={4} mb={1}>
        <FormHelperText
          dangerouslySetInnerHTML={
            { __html: t('PRIVACY_POLICY_SUPLYPOINT') }
          }
        />
      </Box>
      <Box ml={1}>
      <FormGroup row>
        <FormControlLabel
          disabled={!isActiveCups()}
          control={
            <Checkbox
              id="supply_point_accepted"
              color="primary"
              name="supply_point_accepted"
              onClick={handleClick}
              checked={values?.supply_point?.supply_point_accepted}
            />
          }
          label={t('ACCEPT_TERMS')}
          labelPlacement="end"
        />
        </FormGroup>
      </Box>

    </>
  )
}

export default CUPS
