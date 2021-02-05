import React from 'react'
import { useTranslation } from 'react-i18next'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

const handleChangePower = (event, setFieldValue, { moreThan15Kw }) => {
  const regexLessThan15 = /^\d*([.,'])?\d{0,1}/g
  const regexMoreThan15 = /^\d*([.,'])?\d{0,3}/g
  const regex = moreThan15Kw ? regexMoreThan15 : regexLessThan15

  const match = regex.exec(event.target.value)
  let result = match[0].replace(',', '.')
  result = result.replace('\'', '.')

  result = (!moreThan15Kw && result <= 15) ? result
    : (moreThan15Kw && result < 450) ? result : result.slice(0, -1)

  setFieldValue(event.target.name, result)
}

const PowerInputs = (props) => {
  const { t } = useTranslation()
  const { values, handleBlur, errors, touched, numInputs = 2, setFieldValue, namePrefix = false } = props

  return Array.from(Array(numInputs).keys()).map(inputNum => {
    const attr = (inputNum === 0) ? 'power' : `power${inputNum + 1}`
    return (<TextField
      required
      key={attr}
      id={attr}
      name={`${namePrefix ? (namePrefix + '.') : ''}${attr}`}
      label={ !values?.has_service ? t('POTENCIA_A_CONTRACTAR_CONTRACTACIO') : t('QUINA_POTENCIA_TENS_CONTRACTADA') }
      InputProps={{
        autoComplete: 'off',
        endAdornment: <InputAdornment position="end">kW</InputAdornment>,
        startAdornment: (numInputs > 1 ? (<InputAdornment position="start">{`P${inputNum + 1}`}</InputAdornment>) : null)
      }}
      onChange={event => handleChangePower(event, setFieldValue, { moreThan15Kw: true })}
      onBlur={handleBlur}
      value={values[attr]}
      fullWidth
      variant="outlined"
      margin="normal"
      error={(errors[attr] && touched[attr])}
      helperText={(touched[attr] && errors[attr]) || (values.has_service && t('HELP_POPOVER_POWER'))}
    />)
  })
}

export default PowerInputs
