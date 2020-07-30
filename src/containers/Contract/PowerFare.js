import React from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'

const PowerInputs = (props) => {
  const { t } = useTranslation()
  const { values, handleBlur, errors, touched, numInputs = 1, setFieldValue } = props

  const handleChangePower = (event, setFieldValue, { moreThan15Kw }) => {
    const regexLessThan15 = /^\d*([.,'])?\d{0,1}/g
    const regexMoreThan15 = /^\d*([.,'])?\d{0,3}/g
    const regex = moreThan15Kw ? regexMoreThan15 : regexLessThan15

    const match = regex.exec(event.target.value)
    let result = match[0].replace(',', '.')
    result = result.replace('\'', '.')

    setFieldValue(event.target.name, result)
  }

  return Array.from(Array(numInputs).keys()).map(inputNum => {
    const attr = (inputNum === 0) ? 'power' : `power${inputNum + 1}`
    return (<TextField
      required
      key={attr}
      id={attr}
      name={`contract.${attr}`}
      label={t('QUINA_POTENCIA_TENS_CONTRACTADA')}
      InputProps={{
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
      helperText={(touched?.contract && touched?.contract[attr] && errors.contract && errors?.contract[attr]) || t('HELP_POPOVER_POWER')}
    />)
  })
}

const PowerFare = (props) => {
  const { t } = useTranslation()
  const { values, handleBlur, handleChange, errors, touched, rates } = props

  return (
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

        <PowerInputs numInputs={rates[values.contract.rate]?.num_power_periods} {...props} />
      </Box>
    </>
  )
}

export default PowerFare
