import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from './InputField'

import { checkCups } from '../services/api'
import GurbLoadingContext from '../context/GurbLoadingContext'

import { useTheme } from '@mui/material/styles'

const CUPS = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched
  } = props
  const { t } = useTranslation()
  const { loading, setLoading } = useContext(GurbLoadingContext)
  const theme = useTheme()

  useEffect(() => {
    const cups = values.cups
    if (cups?.length >= 20 && cups?.length <= 22) {
      setLoading(true)
      checkCups(cups)
        .then((response) => {
          const status = response?.data?.status
          if (status === 'new') {
            setFieldValue('is_client', false)
          } else {
            setFieldValue('is_client', true)
          }
          setFieldTouched('cups', true)
          setLoading(false)
        })
        .catch(({ response }) => {
          const { error } = response?.data
          setFieldError('cups', `ERROR_${error.code}`)
          setFieldTouched('cups', true)
          setLoading(false)
        })
    }
  }, [values.cups])

  const handleInputCups = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]*/)
    value = value[0].toUpperCase()
    setFieldValue('cups', value)
  }

  const handleInputCupsBlur = () => {
    setFieldTouched('cups', true)
  }

  return (
    <InputField
      name="cups"
      textFieldLabel={t('CUPS_LABEL')}
      textFieldName={t('CUPS_FIELD')}
      textFieldHelper={
        <span>
          {t('CUPS_HELPER_TEXT')}{' '}
          <a
            href={t('CUPS_HELPER_URL')}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.palette.secondary.main, textDecoration: 'underline' }}>
            {t('CUPS_HELPER_LINK')}
          </a>
        </span>
      }
      iconHelper={true}
      handleChange={handleInputCups}
      handleBlur={handleInputCupsBlur}
      touched={touched?.cups}
      value={values?.cups}
      error={errors?.cups}
      isLoading={loading}
      required={true}
    />
  )
}

export default CUPS
