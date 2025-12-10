import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

import {
  checkMember,
  checkIsFromGenerationEnabledZone
} from '../../../services/api'
import { checkVatFormat } from '../../../services/utils'


const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const GenerationMemberIdFields = (props) => {
  const { t } = useTranslation()
  
  const query = useQuery()

  const {
    values,
    handleBlur,
    errors,
    setErrors,
    touched,
    setFieldValue,
    setValues,
    isTesting = false
  } = props

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const handleChangeVat = (event) => {
    let match = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    let value = match[0].toUpperCase()
    setFieldValue('member.vat', value)
  }

  const handleChangeMemberNumber = (event) => {
    let match = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue('member.partner_number', match)
  }

  useEffect(() => {
    const checkIsMember = async () => {
      const tmpValues = {
        ...values,
        member: {
          ...values.member,
          generation_zone_checked: false,
          has_generation_enabled_zone: true,
        }
      }
      setValues(tmpValues)
      setLoading(true)
      let valid = checkVatFormat(values.member.vat)
      if (!valid) {
        setError(true)
      }
      try {
        const response = await checkMember(
          values.member.partner_number,
          values.member.vat
        )
        if (response?.data === true) {
          setError(false)
        } else {
          setError(true)
          setFieldValue('member.checked', false)
        }
      } catch (error) {
        setError(error)
      }

      try {
        let res = await checkIsFromGenerationEnabledZone({
          memberNumber: values.member.partner_number,
          memberVat: values.member.vat
        })
        const tmpValues = {
          ...values,
          member: {
            ...values.member,
            checked: true,
            has_generation_enabled_zone: res.data,
            generation_zone_checked: true
          }
        }
        setValues(tmpValues)
        setErrors({ member: { has_generation_enabled_zone: false } })
      } catch (error) {
        setErrors({
          member: {
            has_generation_enabled_zone: t(
              'GENERATION_FORM_DATA_COULD_NOT_BE_VALIDATED'
            )
          }
        })
      }
      setLoading(false)
    }

    if (
      values?.member?.partner_number &&
      values?.member?.vat &&
      values.member.vat.length >= 9 &&
      !isTesting
    ) {
      checkIsMember()
    } else {
      setFieldValue('member.checked', false)
    }
  }, [t, values.member.partner_number, values.member.vat, setFieldValue, setErrors, isTesting])

  useEffect(() => {
    let hash = query.get('h')
    try {
      hash = hash && atob(hash).split(';')
      if (hash && hash.length > 1) {
        const tmpValues = {
          ...values,
          member: {
            ...values.member,
            partner_number: hash[0],
            vat: hash[1]
          }
        }
        setValues(tmpValues)
        setDisabled(true)
      }
    } catch (error) {
      console.error('Invalid hash code')
    }
  }, [values, setFieldValue, query])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="memberNumber"
          name="member.partner_number"
          label={t('MEMBER_NUMBER')}
          onChange={handleChangeMemberNumber}
          onBlur={handleBlur}
          value={values.member.partner_number}
          fullWidth
          disabled={disabled}
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isLoading && <CircularProgress size={24} />}
                {!isLoading && values?.member?.checked && (
                  <CheckOutlinedIcon color="primary" />
                )}
              </InputAdornment>
            )
          }}
          error={
            error !== false ||
            (errors?.member?.partner_number && touched?.member?.partner_number)
          }
          helperText={
            (touched?.member?.partner_number && errors?.member?.partner_number) ||
            (!values?.member?.checked ? (
              error ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: t('SOCIA_NO_TROBADA')
                  }}
                />
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: t('HELP_POPOVER_SOCIA')
                  }}
                />
              )
            ) : (
              <Typography sx={{
                fontWeight: 500,
                color: 'primary.main'
              }} >
                {t('SOCIA_TROBADA')}
              </Typography>
            ))
          }
        />
      </Grid>
      <Grid id="grid_vat_input" item xs={12} sm={6}>
        <TextField
          required
          id="vat"
          name="member.vat"
          label={t('NIF_LABEL')}
          onChange={handleChangeVat}
          onBlur={handleBlur}
          value={values.member.vat}
          fullWidth
          disabled={disabled}
          variant="outlined"
          margin="normal"
          error={errors?.member?.vat && touched?.member?.vat}
          helperText={
            (touched?.member?.vat && errors?.member?.vat) ||
            t('HELP_POPOVER_NIF')
          }
        />
      </Grid>
    </Grid>
  )
}

export default GenerationMemberIdFields
