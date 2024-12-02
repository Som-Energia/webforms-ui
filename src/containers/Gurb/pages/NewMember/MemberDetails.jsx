import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'

import { checkMember } from '../../../../services/api'
import GurbLoadingContext from '../../../../context/GurbLoadingContext'

const MemberDetails = (props) => {
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
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handleCheckMemberResponse = async () => {
    let status = undefined
    await checkMember(values.member.number, values.member.dni)
      .then((response) => {
        status = response?.state
      })
      .catch(() => {
        status = false
      })
    if (status === true) {
      await setFieldValue('member.is_member', true)
      setErrors({})
    } else {
      await setFieldValue('member.is_member', false)
      await setFieldError('is_member', 'WRONG_VALUES')
      setFieldTouched('member.number', true)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (values?.member?.dni && values?.member?.number) {
      handleCheckMemberResponse()
    }
  }, [values.member.number, values.member.dni])

  const handleInputDni = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    value = value[0].toUpperCase()
    setFieldValue('member.dni', value)
  }

  const handleInputDniBlur = () => {
    setFieldTouched('member.dni', true)
  }

  const handleInputMemberNumber = (event) => {
    let match = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue('member.number', match)
  }
  const handleInputMemberNumberBlur = () => {
    setFieldTouched('member.number', true)
  }

  return (
    <>
      <TextRecomendation title={t('GURB_IS_MEMBER_TITLE')} />
      <InputField
        textFieldLabel={t('GURB_DNI_LABEL')}
        textFieldName={t('GURB_DNI_FIELD')}
        textFieldHelper={t('GURB_DNI_HELPER')}
        iconHelper={true}
        handleChange={handleInputDni}
        handleBlur={handleInputDniBlur}
        touched={touched?.member?.dni}
        value={values?.member.dni}
        error={errors?.member?.dni}
      />
      <InputField
        textFieldLabel={t('GURB_MEMBER_NUMBER_LABEL')}
        textFieldName={t('GURB_MEMBER_NUMBER_FIELD')}
        textFieldHelper={t('GURB_MEMBER_NUMBER_HELPER')}
        iconHelper={true}
        handleChange={handleInputMemberNumber}
        handleBlur={handleInputMemberNumberBlur}
        touched={touched?.member?.number}
        value={values?.member.number}
        error={errors?.is_member}
        isLoading={loading}
      />
    </>
  )
}
export default MemberDetails
