import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'

const PowerFare = (props) => {
  const { t } = useTranslation()
  const { values, handleBlur, handleChange, setFieldValue, errors, touched, rates } = props

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

        <TextField
          required
          id="power"
          name="contract.power"
          label={t('QUINA_POTENCIA_TENS_CONTRACTADA')}
          InputProps={{
            endAdornment: <InputAdornment position="end">kW</InputAdornment>,
            startAdornment: (rates[values.contract.rate]?.num_power_periods > 1 ? (<InputAdornment position="start">P1</InputAdornment>) : null)
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.contract.power}
          fullWidth
          variant="outlined"
          margin="normal"
          error={(errors?.contract?.power && touched?.contract?.power)}
          helperText={(touched?.contract?.power && errors?.contract?.power) || t('HELP_POPOVER_POWER')}
        />
        { rates[values.contract.rate]?.num_power_periods > 1 &&
          <TextField
            required
            id="power2"
            name="contract.power2"
            label={t('QUINA_POTENCIA_TENS_CONTRACTADA')}
            InputProps={{
              startAdornment: <InputAdornment position="start">P2</InputAdornment>,
              endAdornment: <InputAdornment position="end">kW</InputAdornment>
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contract?.power2}
            fullWidth
            variant="outlined"
            margin="normal"
            error={(errors?.contract?.power2 && touched?.contract?.power2)}
            helperText={(touched?.contract?.power2 && errors?.contract?.power2) || t('HELP_POPOVER_POWER')}
          />
        }
        { rates[values.contract.rate]?.num_power_periods > 1 &&
          <TextField
            required
            id="power3"
            name="contract.power3"
            label={t('QUINA_POTENCIA_TENS_CONTRACTADA')}
            InputProps={{
              startAdornment: <InputAdornment position="start">P3</InputAdornment>,
              endAdornment: <InputAdornment position="end">kW</InputAdornment>
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contract?.power3}
            fullWidth
            variant="outlined"
            margin="normal"
            error={(errors?.contract?.power3 && touched?.contract?.power3)}
            helperText={(touched?.contract?.power3 && errors?.contract?.power3) || t('HELP_POPOVER_POWER')}
          />
        }
      </Box>
    </>
  )
}

export default PowerFare
