import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from '../../../../components/InputField'
import Chooser from '../../../../components/NewChooser'
import RequiredTitle from '../../../../components/InputTitle'

import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import Grid from '@mui/material/Grid'

import { iconRequirements } from '../../../../themes/commonStyles'
import {
  iconOffRequirements,
  textHeader4
} from '../../gurbTheme'
import { checkVatFormat } from '../../../../services/utils'

const HolderIdentification = (props) => {
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

  // TODO: use from utils
  const handleCheckNifResponse = async () => {
    let valid = checkVatFormat(values.holder.nif)
    if (valid === true) {
      setFieldError('holder.nif', undefined)
    } else {
      setFieldError('holder.nif', t('INVALID_NIF'))
    }
  }

  useEffect(() => {
    if (values?.holder?.nif && values?.holder?.nif.length > 8) {
      handleCheckNifResponse()
    }
  }, [values.holder.nif])

  const handleInputNif = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    value = value[0].toUpperCase()
    setFieldValue('holder.nif', value)
  }

  const handleInputNifBlur = () => {
    setFieldTouched('holder.nif', true)
  }

  const handleHolderQuestion = (value) => {
    setFieldValue('holder.has_holder', value)
  }

  const options = [
    {
      id: 'holder-same',
      icon: <FeedOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_SAME_HOLDER_HEADER'),
      textBody: t('GURB_SAME_HOLDER_BODY')
    },
    {
      id: 'holder-different',
      icon: <FeedOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_DIFFERENT_HOLDER_HEADER'),
      textBody: t('GURB_DIFFERENT_HOLDER_BODY')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <InputField
          name="holder_vat"
          textFieldLabel={t('GURB_NIF_LABEL')}
          textFieldName={t('GURB_HOLDER_NIF_FIELD')}
          textFieldNameHelper={t('GURB_HOLDER_NIF_FIELD_HELPER')}
          handleChange={handleInputNif}
          handleBlur={handleInputNifBlur}
          touched={touched?.holder?.nif}
          value={values?.holder.nif}
          error={errors?.holder?.nif}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <RequiredTitle
          text={t('GURB_HOLDER_QUESTION')}
          textStyle={textHeader4}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="has_holder"
          options={options}
          value={values.holder.has_holder}
          handleChange={handleHolderQuestion}
        />
      </Grid>
    </Grid>
  )
}
export default HolderIdentification
