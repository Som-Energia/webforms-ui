import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import { checkPhisicalVAT } from '../../services/utils'
import { checkVat } from '../../services/api'
import GurbLoadingContext from '../../context/GurbLoadingContext'

import InputField from '../../components/InputField'
import { handleCheckNifFormat } from '../../utils/commonHandles'
import { useHandleChangeNif } from '../../hooks/useHandleChange'
import { useHandleBlur } from '../../hooks/useHandleBlur'

const MemberIdentifier = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched
  } = props
  const { t } = useTranslation()
  const { setLoading } = useContext(GurbLoadingContext)

  const handleChangeNif = useHandleChangeNif(setFieldValue)
  const handleBlur = useHandleBlur(setFieldTouched)

  // TODO: generalize ?
  const handleCheckNifResponse = async () => {
    let nif_info = undefined
    await checkVat(values?.new_member?.nif)
      .then((response) => {
        nif_info = response?.data
      })
      .catch(() => {
        console.error('UNEXPECTED')
      })
    setFieldError('new_member.nif', undefined)
    if (nif_info?.exists === true) {
      setFieldError('new_member.nif', t('DNI_EXIST'))
    }
    if (nif_info?.valid === false) {
      setFieldError('new_member.nif', t('FILL_NIF'))
    }
  }

  // TODO: generalize ?
  const handleNifValidations = async () => {
    try {
      setLoading(true)
      await handleCheckNifFormat(
        values?.new_member?.nif,
        setFieldError,
        'new_member.nif'
      )
      await handleCheckNifResponse()
    } catch (error) {
      console.error('Error validating nif:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (values?.new_member?.nif && values?.new_member?.nif.length === 9) {
      handleNifValidations()
      let is_physical = checkPhisicalVAT(values?.new_member?.nif)
      setFieldValue(
        'new_member.person_type',
        is_physical ? 'physic-person' : 'legal-person'
      )
    }
  }, [values?.new_member?.nif])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">{t('MEMBER_PAGE_NIF')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputField
          name="new_member.nif"
          textFieldName={t('NIF_FIELD')}
          textFieldHelper={t('MEMBER_NIF_HELPER')}
          handleChange={handleChangeNif}
          handleBlur={handleBlur}
          touched={touched?.new_member?.nif}
          value={values?.new_member.nif}
          error={errors?.new_member?.nif}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="body.xs.regular"
          color="secondary.dark"
          dangerouslySetInnerHTML={{ __html: t('NEW_MEMBER_NO_VAT_HELP') }}
        />
      </Grid>
    </Grid>
  )
}

export default MemberIdentifier
