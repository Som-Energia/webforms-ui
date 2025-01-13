import { useTranslation } from 'react-i18next'

import InputField from './InputField'

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
    setFieldValue
  } = props

  return Array.from(Array(numInputs).keys()).map((inputNum) => {
    const attr = inputNum === 0 ? 'power' : `power${inputNum + 1}`

    return (
      <InputField
        required={true}
        key={attr}
        textFieldLabel={t('QUINA_POTENCIA_TENS_CONTRACTADA')}
        endAdornmentText={'kW'}
        startAdornmentText={
          numInputs <= 2
            ? inputNum === 0
              ? t('PEAK')
              : t('VALLEY')
            : `P${inputNum + 1}`
        }
        numInputs={numInputs}
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
      />
    )
  })
}

export default PowerInputs
