import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'

import { checkPhisicalVAT, checkVatFormat } from '../../services/utils'
import { checkVat } from '../../services/api'
import LoadingContext from '../../context/LoadingContext'

import InputField from '../InputField/InputField'
import { useHandleChangeNif } from '../../hooks/useHandleChange'
import { useHandleBlur } from '../../hooks/useHandleBlur'

const NifCif = (props) => {
  const {
    holder = false,
    values,
    errors,
    touched,
    setFieldValue,
    setValues,
    setFieldError,
    setFieldTouched,
    entity = "", // where we are saving nifcif info
    textFieldNameKey,
    helperText = true
  } = props
  const { t } = useTranslation()
  const { setLoading } = useContext(LoadingContext)
  const MAXINDENTIFIERLENGTH = 9;
  const handleChangeNif = useHandleChangeNif(setFieldValue)
  const handleBlur = useHandleBlur(setFieldTouched)

  const handleCheckNifResponse = async () => {
    let nif_info
    await checkVat(values[entity]?.nif)
      .then((response) => {
        nif_info = response?.data
      })
      .catch((e) => {
        console.error('UNEXPECTED', e)
      })
    setFieldError(`${entity}.nif`, undefined)
    if (nif_info?.is_member === true) {
      setFieldError(`${entity}.nif`, t('DNI_EXIST'))
    }
    if (nif_info?.valid === false) {
      setFieldError(`${entity}.nif`, t('FILL_NIF'))
    }
  }

  const handleNifValidations = async () => {
    try {
      setLoading(true)
      if (!holder) {
        await handleCheckNifResponse()
      }
    } catch (error) {
      console.error('Error validating nif:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (values[entity]?.nif && values[entity]?.nif.length >= 9) {
      const validationObj = checkVatFormat(values[entity]?.nif)
      let is_physical = checkPhisicalVAT(values[entity]?.nif)
      setValues({
        ...values,
        [entity]: {
          ...values[entity],
          person_type: is_physical ? 'physic-person' : 'legal-person',
          nif_valid: validationObj.isValid
        }
      })

      handleNifValidations()
    }
  }, [values[entity]?.nif])

  return (
    <>
      <Grid item xs={12}>
        <InputField
          data-cy={`${entity}.nif`}
          name={`${entity}.nif`}
          textFieldName={t(textFieldNameKey) || t('NIF_FIELD')}
          textFieldHelper={helperText && t('MEMBER_NIF_HELPER')}
          handleChange={handleChangeNif}
          handleBlur={handleBlur}
          touched={touched[entity]?.nif}
          value={values[entity]?.nif}
          error={errors[entity]?.nif }
          required={true}
          customInputProps={{ maxLength: MAXINDENTIFIERLENGTH }}
        />
        <div>VALUES: <pre>{ JSON.stringify(values || {}) }</pre></div>
        <div>ERROR: <pre>{ JSON.stringify(errors || {})}</pre></div>
      </Grid>
    </>
  )
}

export default NifCif
