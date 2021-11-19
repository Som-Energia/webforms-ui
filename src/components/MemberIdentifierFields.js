import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import { checkMember, checkMemberVat } from '../services/api'

const useStyles = makeStyles((theme) => ({
  memberChecked: {
    fontWeight: 500,
    color: theme.palette.primary.main
  }
}))

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const MemberIdentifierFields = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const query = useQuery()

  const { values, handleBlur, handleChange, errors, touched, setFieldValue } =
    props

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const handleChangeVat = (event) => {
    let value = event.target.value.match(/[0-9A-Za-z]{0,12}/)
    value = value[0].toUpperCase()
    setFieldValue('member.vat', value)
  }

  useEffect(() => {
    const checkIsMember = async () => {
      setLoading(true)
      try {
        await checkMemberVat(values.member.vat)
      } catch (error) {
        setError(error)
      }

      try {
        const member = await checkMember(
          values.member.number,
          values.member.vat
        )
        if (member?.state === true && member?.data?.soci?.nom) {
          setFieldValue(
            'member.full_name',
            `${member?.data?.soci?.nom} ${
              member?.data?.soci?.cognom !== member?.data?.soci?.nom
                ? member?.data?.soci?.cognom
                : ''
            }`,
            false
          )
          setFieldValue('member.name', member?.data?.soci?.nom, false)
          setFieldValue('member.address', member?.data?.soci?.adreca, false)
          setFieldValue('member.postal_code', member?.data?.soci?.cp, false)
          setFieldValue('member.state.id', member?.data?.soci?.provincia, false)
          setFieldValue('member.city.id', member?.data?.soci?.municipi, false)
          setFieldValue('member.surname1', member?.data?.soci?.cognom, false)
          setFieldValue('member.email', member?.data?.soci?.email, false)
          setFieldValue('member.phone1', member?.data?.soci?.tel, false)
          setFieldValue('member.phone2', member?.data?.soci?.tel2, false)
          setFieldValue('member.language', member?.data?.soci?.lang, false)

          setError(false)
          setFieldValue('member.checked', true)
        } else {
          setError(true)
          setFieldValue('member.checked', false)
        }
      } catch (error) {
        setError(error)
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
      console.log('Invalid hash code')
    }
  }, [query.get('h'), values, setFieldValue])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="memberNumber"
          name="member.number"
          label={t('NUMERO_SOCI')}
          onChange={handleChange}
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
              <span className={classes.memberChecked}>
                {t('SOCIA_TROBADA')}: {values?.member?.full_name}
              </span>
            ))
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="vat"
          name="member.vat"
          label={t('VAT')}
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
