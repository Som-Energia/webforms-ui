import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from '../../components/InputField'

import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { checkIbanFormat } from '../../../../services/utils'
import GurbLoadingContext from '../../../../context/GurbLoadingContext'

import { textCheckbox } from '../../gurbTheme'
import Grid from '@mui/material/Grid'

const HolderIban = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched
  } = props

  const { t } = useTranslation()
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handleCheckIbanResponse = async () => {
    setLoading(true)
    const valid = checkIbanFormat(values.holder.iban)
    if (valid) {
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

  const handleCheckboxChange = async (event) => {
    let value = event.target.checked
    await setFieldValue('holder.direct_debit_accepted', value)
    setFieldTouched('holder.direct_debit_accepted', true)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <InputField
          name="iban"
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
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          sx={{ ...textCheckbox }}
          control={
            <Checkbox
              data-cy="iban_check"
              checked={values?.holder.direct_debit_accepted}
              onChange={handleCheckboxChange}
            />
          }
          label={t('GURB_ACCEPT_DIRECT_DEBIT')}
        />
      </Grid>
    </Grid>
  )
}
export default HolderIban
