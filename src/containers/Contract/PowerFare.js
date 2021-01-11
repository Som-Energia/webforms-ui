import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'

import { calculateTariff } from '../../services/utils'

const handleChangePower = (event, setFieldValue, { moreThan15Kw }) => {
  const regexLessThan15 = /^\d*([.,'])?\d{0,1}/g
  const regexMoreThan15 = /^\d*([.,'])?\d{0,3}/g
  const regex = moreThan15Kw ? regexMoreThan15 : regexLessThan15

  const match = regex.exec(event.target.value)
  let result = match[0].replace(',', '.')
  result = result.replace('\'', '.')

  setFieldValue(event.target.name, result)
}

const PowerInputs = (props) => {
  const { t } = useTranslation()
  const { values, handleBlur, errors, touched, numInputs = 1, setFieldValue } = props

  return Array.from(Array(numInputs).keys()).map(inputNum => {
    const attr = (inputNum === 0) ? 'power' : `power${inputNum + 1}`
    return (<TextField
      required
      key={attr}
      id={attr}
      name={`contract.${attr}`}
      label={ !values?.contract?.has_service ? t('POTENCIA_A_CONTRACTAR_CONTRACTACIO') : t('QUINA_POTENCIA_TENS_CONTRACTADA') }
      InputProps={{
        autoComplete: 'off',
        endAdornment: <InputAdornment position="end">kW</InputAdornment>,
        startAdornment: (numInputs > 1 ? (<InputAdornment position="start">{`P${inputNum + 1}`}</InputAdornment>) : null)
      }}
      onChange={event => handleChangePower(event, setFieldValue, { moreThan15Kw: true })}
      onBlur={handleBlur}
      value={values.contract[attr]}
      fullWidth
      variant="outlined"
      margin="normal"
      error={(errors?.contract && errors?.contract[attr] && touched?.contract && touched?.contract[attr])}
      helperText={(touched?.contract && touched?.contract[attr] && errors.contract && errors?.contract[attr]) || (values?.contract?.has_service && t('HELP_POPOVER_POWER'))}
    />)
  })
}

const PowerFare = (props) => {
  const { t } = useTranslation()
  const { values, handleBlur, handleChange, errors, touched, rates, setFieldValue } = props

  useEffect(() => {
    if (values?.contract?.has_service === false) {
      const tariff = calculateTariff(values.contract)
      setFieldValue('contract.rate', tariff)
    }
  }, [values.contract.fare, values.contract.moreThan15Kw, values.contract.power, values.contract.power2, values.contract.power3])

  return values?.contract?.has_service ? (
    <>
      <StepHeader title={t('TARIFA_I_POTENCIA')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('HELP_TARIFA_CANVI_COMERCIALITZADORA') }}
      />
      <Box mt={3} mb={1}>
        <TextField
          select
          required
          fullWidth
          id="rate"
          name="contract.rate"
          label={t('QUINA_TARIFA_TENS_CONTRACTADA')}
          value={values?.contract?.rate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors?.contract?.rate && touched?.contract?.rate}
          helperText={(touched?.contract?.rate && errors?.contract?.rate) ? errors?.contract?.rate : t('CURRENT_RATE')}
          variant="outlined"
        >
          {
            Object.keys(rates).map(name => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))
          }
        </TextField>

        <PowerInputs numInputs={rates[values?.contract?.rate]?.num_power_periods} {...props} />
      </Box>
    </>
  )
    : (
      <>
        <StepHeader title={t('TARIFA_I_POTENCIA')} />
        <Box mt={3} mb={0}>
          <TextField
            select
            required
            id="phases"
            name="contract.phases"
            label={t('TIPUS_INSTALLACIO_CONTRACTACIO')}
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.contract?.phases}
            error={(errors?.contract?.phases && touched?.contract?.phases)}
            helperText={(touched?.contract?.phases && errors?.contract?.phases)}
          >
            <MenuItem value="mono">
              {t('PHASE_MONO')}
            </MenuItem>
            <MenuItem value="tri">
              {t('PHASE_TRI')}
            </MenuItem>
          </TextField>
        </Box>

        <Box mx={1} mt={0} mb={1}>
          <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_INSTALL_TYPE', { url: t('HELP_INSTALL_TYPE_URL') }) }}></FormHelperText>
        </Box>

        <Box mt={1} mb={0}>
          <FormControlLabel
            control={<Checkbox checked={values?.contract?.moreThan15Kw === true} onChange={handleChange} name="contract.moreThan15Kw" color="primary" />}
            label={t('MES_GRAN_DE_15KW_CONTRACTACIO')}
          />

          <PowerInputs numInputs={ values?.contract?.moreThan15Kw === true ? 3 : 1 } {...props} />
        </Box>

        <Box mx={1} mt={0} mb={1}>
          <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_POTENCIA', { url: t('HELP_POTENCIA_URL') }) }}></FormHelperText>
        </Box>
        { !values?.contract?.moreThan15Kw &&
          <>
            <Box mt={1} mb={0}>
              <TextField
                select
                required
                id="fare"
                name="contract.fare"
                label={t('DISCRIMINACIO_HORARIA_CONTRACTACIO')}
                onChange={event => handleChange(event)}
                variant="outlined"
                margin="normal"
                fullWidth
                value={ (!values?.contract?.moreThan15Kw) ? values?.contract?.fare : ''}
                error={(errors?.contract?.fare && touched?.contract?.fare)}
                helperText={(touched?.contract?.fare && errors?.contract?.fare)}
              >
                <MenuItem value="nodh">
                  {t('SENSE_DISCRIMINACIO_HORARIA')}
                </MenuItem>
                <MenuItem value="dh">
                  {t('AMB_DISCRIMINACIO_HORARIA')}
                </MenuItem>
              </TextField>
            </Box>
            <Box mx={1} mt={0} mb={1}>
              <FormHelperText
                dangerouslySetInnerHTML={{ __html: t('HELP_DISCRIMINACIO_HORARIA', { url: t('HELP_DISCRIMINACIO_HORARIA_URL') }) }}
              />
            </Box>
          </>
        }
      </>
    )
}

export default PowerFare
