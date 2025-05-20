import { useTranslation } from 'react-i18next'

import InputField from './InputField'
import Grid from '@mui/material/Grid'

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
    name,
    values,
    handleBlur,
    errors,
    touched,
    numInputs = 2,
    setFieldValue
  } = props

  return (
    <Grid container spacing={2}>
      {Array.from(Array(numInputs).keys()).map((inputNum) => {
        const attr = inputNum === 0 ? 'power1' : `power${inputNum + 1}`
        const moreThan15Kw = numInputs === 2 ? false : true
        return (
          <Grid item xs={12}>
            <InputField
              name={`${name}.${attr}`}
              required={true}
              key={attr}
              textFieldName={
                numInputs <= 2
                ? inputNum === 0
                  ? t('GURB_CURRENT_PEAK')
                  : t('GURB_CURRENT_VALLEY')
                : t('CURRENT_POWER')}
              endAdornmentText={'kW'}
              startAdornmentText={
                numInputs <= 2
                  ? inputNum === 0
                    ? t('PEAK')
                    : t('VALLEY')
                  : `P${inputNum + 1}`
              }
              numInputs={numInputs}
              handleChange={(event) =>
                handleChangePower(event, setFieldValue, {
                  moreThanOneDecimal: moreThan15Kw,
                  moreThan15Kw: moreThan15Kw
                })
              }
              handleBlur={handleBlur}
              touched={touched?.power}
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
