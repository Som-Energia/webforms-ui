import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import InputField from './InputField'

import { checkCups } from '../services/api'
import { MAX_STEPS_NUMBER } from '../containers/Gurb/GurbFormRequirements'

const CUPS = (props) => {
  const {
    values,
    errors,
    touched,
    setValues,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setMaxStepNum
  } = props
  const { t } = useTranslation()
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    const cups = values.cups
    if (cups?.length >= 20 && cups?.length <= 22) {
      setLoading(true)
      checkCups(cups)
        .then((response) => {
          setValues({
            ...values,
            ...{
              new_contract:
                response?.data?.status === 'new' ||
                response?.data?.status === 'inactive',
              knowledge_of_distri: response?.data?.knowledge_of_distri,
              tariff_name: response?.data?.tariff_name
            }
          })
          setMaxStepNum(
            response?.data?.status === 'new' || response?.data?.status === 'inactive'
              ? MAX_STEPS_NUMBER["MAX_STEP_NUMBER_NEW_CONTRACT"]
              : MAX_STEPS_NUMBER["MAX_STEP_NUMBER_DEFAULT"]
          )
          setLoading(false)
        })
        .catch(({ response }) => {
          setFieldError('cups', t('ERROR_INVALID_FIELD'))
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
      textFieldName={t('CUPS_FIELD')}
      textFieldHelper={
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: 0,
            color: 'secondary.extraDark'
          }}>
          {t('CUPS_HELPER_TEXT')}{' '}
          <Link
            href={t('CUPS_HELPER_URL')}
            target="_blank"
            rel="noopener noreferrer"
            color="link.main">
            {t('CUPS_HELPER_LINK')}
          </Link>
        </Typography>
      }
      handleChange={handleInputCups}
      handleBlur={handleInputCupsBlur}
      touched={touched?.cups}
      value={values?.cups}
      error={errors?.cups || errors?.new_contract || errors?.knowledge_of_distri}
      isLoading={loading}
      required={true}
    />
  )
}

export default CUPS
