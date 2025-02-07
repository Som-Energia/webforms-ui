import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../components/Chooser'
import SomStepper from '../../components/SomStepper'
import RequiredTitle from '../../components/InputTitle'

import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import Box from '@mui/material/Box'

import { checkMemberVat } from '../../../../services/api'
import GurbLoadingContext from '../../../../context/GurbLoadingContext'

import {
  iconOffRequirements,
  iconRequirements,
  textHeader4
} from '../../gurbTheme'

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
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handleCheckNifResponse = async () => {
    let status = undefined
    setLoading(true)
    await checkMemberVat(values.holder.nif)
      .then((response) => {
        status = response?.state
      })
      .catch(() => {
        status = false
      })
    if (status === true) {
      setFieldError('holder.nif', undefined)
    } else {
      setFieldError('holder.nif', t('INVALID_NIF'))
    }
    setLoading(false)
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
    <>
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation
          title={t('GURB_HOLDER_ID_TITLE')}
          text={t('GURB_HOLDER_ID_SUBTITLE')}
        />
        <SomStepper step={activeStep} connectors={7 + 1} />
      </Box>
      <InputField
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
      <Box marginTop={'3rem'}>
        <RequiredTitle
          text={t('GURB_HOLDER_QUESTION')}
          textStyle={textHeader4}
          required={true}
        />
        <Chooser
          options={options}
          value={values.holder.has_holder}
          handleChange={handleHolderQuestion}
        />
      </Box>
    </>
  )
}
export default HolderIdentification
