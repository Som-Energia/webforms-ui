import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'

import StepHeader from '../../components/StepHeader'
import { checkMember, checkMemberVat } from '../../services/api'

const useStyles = makeStyles((theme) => ({
  memberChecked: {
    fontWeight: 500,
    color: theme.palette.primary.main
  }
}))

const MemberIdentifier = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const { values, handleBlur, handleChange, errors, touched, setFieldValue } = props
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const checkIsMember = async () => {
      setLoading(true)
      try {
        await checkMemberVat(values.member.vat)
      } catch (error) {
        console.log(error)
        setError(error)
      }

      try {
        const member = await checkMember(values.member.number, values.member.vat)
        console.log(member)
        if (member?.data?.soci?.nom) {
          setFieldValue('member.checked', true)
          setError(null)
        }
        else {
          setFieldValue('member.checked', false)
        }
        setFieldValue('member.full_name', `${member?.data?.soci?.nom} ${member?.data?.soci?.cognom}`, false)
        setFieldValue('member.name', member?.data?.soci?.nom, '')
        setFieldValue('member.address', member?.data?.soci?.adreca, '')
        setFieldValue('member.postal_code', member?.data?.soci?.cp, '')
        setFieldValue('member.surname1', member?.data?.soci?.cognom, '')
        setFieldValue('member.email', member?.data?.soci?.email, '')
        setFieldValue('member.phone1', member?.data?.soci?.tel, '')
        setFieldValue('member.phone2', member?.data?.soci?.tel2, '')
        setFieldValue('member.language', member?.data?.soci?.lang, '')

      } catch (error) {
        console.log(error)
        setError(error)
      }

      setLoading(false)
    }
    if (values?.member?.number &&
      values?.member?.vat && values.member.vat.length >= 8) {
      checkIsMember()
    }
  }, [values.member.number, values.member.vat, setFieldValue])

  return (
    <>
      <StepHeader title={t('CONTRACT_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('MEMBER_IDENTIFIER_DESC') }}
      />
      <Box mt={3} mb={1}>
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
              variant="outlined"
              margin="normal"
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    { isLoading &&
                      <CircularProgress size={24} />
                    }
                    { !isLoading && values?.member?.checked &&
                      <CheckOutlinedIcon color="primary" />
                    }
                  </InputAdornment>
              }}
              error={(errors?.member?.number && touched?.member?.number) || error}
              helperText={(touched?.member?.number && errors?.member?.number) ||
                (!values?.member?.checked
                  ? error ? t('SOCIA_NO_TROBADA') : <span
                    dangerouslySetInnerHTML={{ __html: t('HELP_POPOVER_SOCIA') }}
                  />
                  : <span className={classes.memberChecked}>{t('SOCIA_TROBADA')}: {values?.member?.full_name}</span>
                )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="vat"
              name="member.vat"
              label={t('VAT')}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.member.vat}
              fullWidth
              variant="outlined"
              margin="normal"
              error={(errors?.member?.vat && touched?.member?.vat)}
              helperText={(touched?.member?.vat && errors?.member?.vat) || t('HELP_POPOVER_NIF')}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default MemberIdentifier
