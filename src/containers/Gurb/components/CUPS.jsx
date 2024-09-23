import { useTranslation } from 'react-i18next'
import InputField from './InputField'

const CUPS = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = props
  const { t } = useTranslation()

  const handleInputCups = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,22}/)
    value = value[0].toUpperCase()
    setFieldValue('cups', value)
  }

  const handleInputCupsBlur = () => {
    setFieldTouched('cups', true)
  }

  return (
    <InputField
      textFieldLabel={t('GURB_CUPS_LABEL')}
      textFieldName={t('GURB_CUPS_FIELD')}
      textFieldHelper={t('GURB_CUPS_HELPER')}
      iconHelper={true}
      handleChange={handleInputCups}
      handleBlur={handleInputCupsBlur}
      touched={touched?.cups}
      value={values.cups}
      error={errors?.cups}
    />
  )
}

export default CUPS
