import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from './InputField'

import { checkCups } from '../../../services/api'

const CUPS = (props) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } = props
  const { t } = useTranslation()
  // const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const cups = values.cups
    if (cups?.length > 18) {
      // setIsLoading(true)
      checkCups(cups)
        .then((response) => {
          const status = response?.data?.status
          if (status === 'new') {
            setFieldValue('is_client', false)
          } else {
            setFieldValue('is_client', true)
          }
          // setIsLoading(false)
        })
        .catch((error) => {
          console.error(error.response)
          // setIsLoading(false)
        })
    }
  }, [values.cups])

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
