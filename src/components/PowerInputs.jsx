import { useTranslation } from 'react-i18next'

import InputField from './InputField'
import Grid from '@mui/material/Grid'

const handleChangePower = (
  event,
  setFieldValue,
  { moreThanOneDecimal = false }
) => {
  const regexOneDecimal = /^\d*([.,'])?\d{0,1}/g
  const regexThreeDecimal = /^\d*([.,'])?\d{0,3}/g
  const regex = moreThanOneDecimal ? regexThreeDecimal : regexOneDecimal

  const match = regex.exec(event.target.value)
  let result = match[0].replace(',', '.')
  result = result.replace("'", '.')

  setFieldValue(event.target.name, result)
}

const PowerInputs = (props) => {
  const { t } = useTranslation()
  const {
    name,
    values,
    handleBlur,
    errors,
    touched,
    numInputs = 2,
    setFieldValue,
    has_light
  } = props

  return (
    <Grid container spacing={2}>
      {Array.from(Array(numInputs).keys()).map((inputNum) => {
        const attr = inputNum === 0 ? 'power1' : `power${inputNum + 1}`
        const moreThan15Kw = numInputs === 2 ? false : true
        const textPower = has_light == 'light-on' ? 'CURRENT':'WHICH'
        return (
          <Grid key={attr} item xs={12}>
            <InputField
              name={`${name}.${attr}`}
              required={true}
              textFieldName={
                moreThan15Kw
                ? t(textPower + '_POWER')
                : inputNum === 0
                  ? t(textPower + '_PEAK')
                  : t(textPower + '_VALLEY')
              }
              endAdornmentText={'kW'}
              startAdornmentText={
                moreThan15Kw
                  ? `P${inputNum + 1}`
                  : inputNum === 0
                    ? t('PEAK')
                    : t('VALLEY')
              }
              numInputs={numInputs}
              handleChange={(event) =>
                handleChangePower(event, setFieldValue, {
                  moreThanOneDecimal: has_light == 'light-on' || moreThan15Kw
                })
              }
              handleBlur={handleBlur}
              touched={touched?.power[attr]}
              value={values[attr]}
              error={errors?.[attr]}
              //textFieldHelper={
                //t('HELP_POPOVER_POWER')
              //}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PowerInputs
