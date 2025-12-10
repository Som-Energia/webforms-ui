import React from 'react'
import { useTranslation } from 'react-i18next'

import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

const handleChangePower = (
  event,
  setFieldValue,
  { moreThanOneDecimal = false, moreThan15Kw = false }
) => {
  const regexOneDecimal = /^\d*([.,'])?\d{0,1}/g
  const regexThreeDecimal = /^\d*([.,'])?\d{0,3}/g
  const regex = moreThanOneDecimal ? regexThreeDecimal : regexOneDecimal

  const match = regex.exec(event.target.value)
  let result = match[0].replace(',', '.')
  result = result.replace("'", '.')

  if (!moreThan15Kw && result > 15) {
    result = result.slice(0, -1)
  }

  setFieldValue(event.target.name, result)
}

const PowerInputs = (props) => {
  const { t } = useTranslation()
  const {
    values,
    handleBlur,
    errors,
    touched,
    numInputs = 2,
    setFieldValue,
    namePrefix = false
  } = props

  return Array.from(Array(numInputs).keys()).map((inputNum) => {
    const attr = inputNum === 0 ? 'power' : `power${inputNum + 1}`
    const name = `${namePrefix ? namePrefix + '.' : ''}${attr}`
    const label = !values?.has_service
      ? t('POTENCIA_A_CONTRACTAR_CONTRACTACIO')
      : t('CURRENT_CONTRACTED_POWER')

    return (
      <TextField
        required
        key={attr}
        id={attr}
        name={name}
        label={label}
        InputProps={{
          autoComplete: 'off',
          endAdornment: <InputAdornment position="end">kW</InputAdornment>,
          startAdornment: numInputs > 1 && (
            <InputAdornment position="start">
              {numInputs <= 2
                ? inputNum === 0
                  ? t('PEAK')
                  : t('VALLEY')
                : `P${inputNum + 1}`}
            </InputAdornment>
          )
        }}
        onChange={(event) =>
          handleChangePower(event, setFieldValue, {
            moreThanOneDecimal: values?.has_service || values?.moreThan15Kw,
            moreThan15Kw: values?.moreThan15Kw
          })
        }
        onBlur={handleBlur}
        value={values?.[attr]}
        error={errors?.[attr] && touched?.[attr]}
        helperText={
          (touched?.[attr] && errors?.[attr]) ||
          (values.has_service && t('HELP_POPOVER_POWER'))
        }
        fullWidth
        variant="outlined"
        margin="normal"
      />
    )
  })
}

export default PowerInputs