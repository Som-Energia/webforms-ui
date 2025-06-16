import { useTranslation } from 'react-i18next'

import InputField from './InputField'
import Grid from '@mui/material/Grid'

const handleChangePower = (event, setFieldValue) => {
  const regexThreeDecimal = /^\d*([.,'])?\d{0,3}/g
  const match = regexThreeDecimal.exec(event.target.value)

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
    setFieldValue
  } = props

  return (
    <Grid container spacing={2}>
      {Array.from(Array(numInputs).keys()).map((inputNum) => {
        const attr = inputNum === 0 ? 'power1' : `power${inputNum + 1}`
        const moreThan15Kw = numInputs === 2 ? false : true
        return (
          <Grid key={attr} item xs={12}>
            <InputField
              name={`${name}.${attr}`}
              required={true}
              textFieldName={
                numInputs <= 2
                ? inputNum === 0
                  ? t('CURRENT_PEAK')
                  : t('CURRENT_VALLEY')
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
                handleChangePower(event, setFieldValue)
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
