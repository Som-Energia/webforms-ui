import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'

import { checkMember } from '../services/api'
import { checkVatFormat } from '../services/utils'

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const MemberIdentifierFields = (props) => {
  const { t } = useTranslation()
  const query = useQuery()

  const { values, handleBlur, errors, touched, setFieldValue } = props

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
    setFieldValue('member.number', match)
  }

  useEffect(() => {
    const checkIsMember = async () => {
      setLoading(true)
      let valid = checkVatFormat(values.member.vat)  // TODO: Check if checkVatFormat returns objecto or bool 👀
      if (!valid) {
        setError(true)
      } else {
        try {
          const response = await checkMember(
            values.member.number,
            values.member.vat
          )
          if (response?.data === true) {
            setError(false)
            setFieldValue('member.checked', true)
          } else {
            setError(true)
            setFieldValue('member.checked', false)
          }
        } catch (error) {
          setError(error)
        }
      }
      setLoading(false)
    }

    if (
      values?.member?.number &&
      values?.member?.vat &&
      values.member.vat.length >= 9
    ) {
      checkIsMember()
    } else {
      setFieldValue('member.checked', false)
    }
  }, [values.member.number, values.member.vat, setFieldValue])

  useEffect(() => {
    let hash = query.get('h')
    try {
      hash = hash && atob(hash).split(';')
      if (hash && hash.length > 1) {
        setFieldValue('member.number', hash[0], false)
        setFieldValue('member.vat', hash[1])
        setDisabled(true)
      }
    } catch (error) {
      console.error('Invalid hash code')
    }
  }, [query.get('h'), values, setFieldValue])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="memberNumber"
          name="member.number"
          label={t('MEMBER_NUMBER')}
          onChange={handleChangeMemberNumber}
          onBlur={handleBlur}
          value={values.member.number}
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
            (errors?.member?.number && touched?.member?.number)
          }
          helperText={
            (touched?.member?.number && errors?.member?.number) ||
            (!values?.member?.checked ? (
              error ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: t('MEMBER_NOT_FOUND')
                  }}
                />
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: t('HELP_POPOVER_MEMBER')
                  }}
                />
              )
            ) : (
              <Typography
                sx={{
                  fontWeight: 500,
                  color: 'primary.main'
                }}
                variant="helpertext">
                {t('MEMBER_FOUND')}
              </Typography>
            ))
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
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

export default MemberIdentifierFields
