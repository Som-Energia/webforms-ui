import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'
import SomStepper from '../../components/SomStepper'

import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import { checkIban } from '../../../../services/api'
import GurbLoadingContext from '../../../../context/GurbLoadingContext'

import { textCheckbox } from '../../gurbTheme'

const HolderIban = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched
  } = props

  const { t } = useTranslation()
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handleCheckIbanResponse = async () => {
    let status = undefined
    setLoading(true)
    await checkIban(values.holder.iban)
      .then((response) => {
        status = response?.state
      })
      .catch(() => {
        status = false
      })
    if (status === true) {
      await setFieldError('holder.iban_valid', undefined)
      setFieldValue('holder.iban_valid', true)
    } else {
      await setFieldError('holder.iban_valid', t('INVALID_IBAN'))
      setFieldValue('holder.iban_valid', false)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (values?.holder?.iban && values?.holder?.iban.length > 27) {
      handleCheckIbanResponse()
    }
  }, [values.holder.iban])

  const handleInputIban = (event) => {
    let value = event.target.value
    if (value) {
      value = value.match(/[\s0-9A-Za-z]{0,29}/)
      value = value[0].toUpperCase()
      value = value.split(' ').join('')
      value = value.match(/.{1,4}/g).join(' ')
    }
    setFieldValue('holder.iban', value)
  }

  const handleInputIbanBlur = () => {
    setFieldTouched('holder.iban', true)
  }

  const handleCheckboxChange = (event) => {
    let value = event.target.checked
    setFieldValue('holder.direct_debit_accepted', value)
    setFieldTouched('holder.direct_debit_accepted', true)
  }

  return (
    <>
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation title={t('GURB_IBAN_TITLE')} />
        <SomStepper step={activeStep} connectors={7 + 1} />
      </Box>
      <InputField
        textFieldLabel={t('GURB_IBAN_LABEL')}
        textFieldName={t('GURB_IBAN_FIELD')}
        textFieldNameHelper={t('GURB_IBAN_FIELD_HELPER')}
        textFieldHelper={t('GURB_IBAN_EXAMPLE')}
        handleChange={handleInputIban}
        handleBlur={handleInputIbanBlur}
        touched={touched?.holder?.iban}
        value={values?.holder.iban}
        error={errors?.holder?.iban_valid || errors?.holder?.iban}
        isLoading={loading}
      />
      <FormControlLabel
        sx={{ ...textCheckbox, marginTop: '2rem' }}
        control={
          <Checkbox
            checked={values?.holder.direct_debit_accepted}
            onChange={handleCheckboxChange}
          />
        }
        label={t('GURB_ACCEPT_DIRECT_DEBIT')}
      />
    </>
  )
}
export default HolderIban
