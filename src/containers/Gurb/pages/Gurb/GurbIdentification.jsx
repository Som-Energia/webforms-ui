import React, { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import InputField from '../../../../components/InputField'

import { useTranslation } from 'react-i18next'

import CUPS from '../../../../components/CUPS'
import { checkMember } from '../../../../services/api'


const GurbIdentification = (props) => {
  const { values, setFieldValue, touched, setFieldTouched, errors } = props
  const { t } = useTranslation()

  const [ loading, setLoading ] = useState(false)

  const handleCheckMemberResponse = async () => {
    let status = undefined
    setLoading(true)
    await checkMember(values.member.number, values.member.nif)
      .then((response) => {
        status = response?.data
      })
      .catch(() => {
        status = false
      })
    if (status === true) {
      await setFieldValue('member.link_member', true)
    } else {
      await setFieldValue('member.link_member', false)
      await setFieldError('link_member', t('SOCIA_NO_TROBADA'))
      setFieldTouched('member.number', true)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (values?.member?.nif && values?.member?.number) {
      handleCheckMemberResponse()
    }
  }, [values.member.number, values.member.nif])


  const handleInputNif = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    value = value[0].toUpperCase()
    setFieldValue('member.nif', value)
  }

  const handleInputNifBlur = () => {
    setFieldTouched('member.nif', true)
  }

  const handleInputMemberNumber = (event) => {
    let match = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue('member.number', match)
  }
  const handleInputMemberNumberBlur = () => {
    setFieldTouched('member.number', true)
  }

  return (
    <Grid container spacing={2}>

      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t('LINK_MEMBER_TITLE')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CUPS {...props} />
      </Grid>

      <Grid item xs={12}>
        <InputField
          name="vat"
          textFieldName={t('LINK_MEMBER_NIF_TITLE')}
          textFieldHelper={t('LINK_MEMBER_NIF_HELPER')}
          handleChange={handleInputNif}
          handleBlur={handleInputNifBlur}
          touched={touched?.member?.nif}
          value={values?.member.nif}
          error={errors?.member?.nif}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <InputField
          name="code"
          textFieldName={t('LINK_MEMBER_NUMBER_TITLE')}
          textFieldHelper={t('LINK_MEMBER_NUMBER_HELPER')}
          handleChange={handleInputMemberNumber}
          handleBlur={handleInputMemberNumberBlur}
          touched={touched?.member?.number}
          value={values?.member.number}
          error={errors?.link_member}
          isLoading={loading}
          required={true}
        />
      </Grid>
    </Grid>
  )
}

export default GurbIdentification
