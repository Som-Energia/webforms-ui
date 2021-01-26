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

import Chooser from '../../components/Chooser'
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

  const handleChangeChooser = ({ option }) => {
    setFieldValue('contract.moreThan15Kw', option)
    // validateForm()
  }

  useEffect(() => {
    const tariff = calculateTariff(values.contract)
    setFieldValue('contract.rate', tariff)
  }, [values.contract.moreThan15Kw])

  return (
    <>
      <StepHeader title={t('TARIFA_I_POTENCIA')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('HELP_TARIFA_CANVI_COMERCIALITZADORA') }}
      />
      { values?.contract?.has_service === false &&
        <>
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
        </>
      }
      <Box mt={3} mb={1}>
        <Chooser
          question={t('POWER_QUESTION')}
          onChange={handleChangeChooser}
          value={values?.contract?.moreThan15Kw}
          options={[
            {
              value: false,
              label: t('MENOR_IGUAL_A_15KW_CONTRACTACIO')
            },
            {
              value: true,
              label: t('MES_GRAN_DE_15KW_CONTRACTACIO')
            }
          ]}
        />
      </Box>

      <Box mt={2} mb={1}>
        <PowerInputs numInputs={rates[values?.contract?.rate]?.num_power_periods} {...props} />
      </Box>
    </>
  )
}

export default PowerFare
