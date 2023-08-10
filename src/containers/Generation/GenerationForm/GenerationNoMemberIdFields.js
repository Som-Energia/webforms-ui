import React, { useState, useEffect, useCallback } from 'react'
import { Alert } from '@material-ui/lab'
import { Typography, TextField } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import VATField from '../../../components/VATField'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import { checkIsPostalCodeFromGenerationEnabledZone } from '../../../services/api'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1rem',
    marginTop: '16px',
    fontWeight: 500
  },
  titleWithMargin: {
    marginBottom: theme.spacing(1)
  },
  titleWithMarginPlus: {
    marginBottom: theme.spacing(3)
  }
}))

const GenerationNoMemberFields = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(false)

  const {
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
  } = props

  const onChangeVAT = (params) => {
    const { vat, isPhisical, valid } = params
    setFieldValue('member.isphisical', isPhisical, false)
    setFieldValue('member.vatvalid', valid, false)
    setFieldValue('member.exists', false, false)
    setFieldValue('member.vat', vat)
    if (vat !== '') {
      setFieldTouched('member.vat', true)
    }
  }

  const onChangePostalCode = (event) => {
    if (values?.member?.postal_code_checked) {
      setFieldValue('member.postal_code_checked', false)
    }
    setFieldValue('member.postal_code', event.target.value)
  }

  const checkPostalCode = useCallback(async () => {
    setIsLoading(true)
    try {
      let result = await checkIsPostalCodeFromGenerationEnabledZone({
        postalCode: values?.member?.postal_code
      })
      setFieldValue('member.has_generation_enabled_zone', result.data)
      setFieldValue('member.generation_zone_checked', true)
      setFieldValue('member.postal_code_checked', true)
      setIsLoading(false)
    } catch (error) {
      setFieldValue('member.generation_zone_checked', true)
      setFieldValue('member.postal_code_checked', true)
      setIsLoading(false)
    }
  }, [values?.member?.postal_code, setFieldValue])

  useEffect(() => {
    if (values?.member?.postal_code?.length === 5) {
      checkPostalCode()
    }
  }, [checkPostalCode, values?.member?.postal_code])

  return (
    <>
      <Box id="box_no_member_identifier" mt={0} mb={2}>
        <Typography
          variant="h6"
          className={`${classes.title} ${classes.titleWithMarginPlus}`}
          dangerouslySetInnerHTML={{
            __html: t('INTRODUCE EL CODIGO POSTAL')
          }}
        />
        <Box id="box_no_member_vat_input" mt={2} mb={1}>
          <TextField
            id={'input_postalcode'}
            name={'member.postal_code'}
            label={t('HOLDER_POSTALCODE')}
            variant="outlined"
            required
            fullWidth
            value={values?.member?.postal_code}
            onChange={onChangePostalCode}
            onBlur={handleBlur}
            error={errors?.member?.postal_code && touched?.member?.postal_code}
            helperText={
              touched?.member?.postal_code && errors?.member?.postal_code
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading && <CircularProgress size={24} />}
                  {!isLoading && values?.member?.postal_code_checked && (
                    <CheckOutlinedIcon color="primary" />
                  )}
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>
      {values?.member?.has_generation_enabled_zone &&
      values.member.postal_code_checked ? (
        <>
          <Box id="box_no_member_identifier" mt={0} mb={2}>
            <Typography
              variant="h6"
              className={`${classes.title} ${classes.titleWithMarginPlus}`}
              dangerouslySetInnerHTML={{
                __html: t('CONTRIBUTION_MEMBER_VAT')
              }}
            />
            <Box id="box_no_member_vat_input" mt={2} mb={1}>
              <VATField
                id="vat"
                name="member.vat"
                label={t('VAT_LABEL')}
                variant="outlined"
                fullWidth
                required
                value={values?.member?.vat}
                onChange={onChangeVAT}
                onBlur={handleBlur}
                error={
                  (errors?.member?.vat && touched?.member?.vat) ||
                  (touched?.member?.vat &&
                    values?.member?.vatvalid === false) ||
                  (touched?.member?.vat && values?.member?.exists === true)
                }
                helperText={
                  (touched?.member?.vat && errors?.member?.vat) ||
                  (touched?.member?.vat && errors?.member?.vatvalid) ||
                  (touched?.member?.vat && errors?.member?.exists)
                }
              />
            </Box>
          </Box>
          <Box mt={0} mb={2}>
            <Alert severity="warning">
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t('GENERATION_CONTRIBUTION_MEMBER_WARNING')
                }}
              />
            </Alert>
          </Box>
        </>
      ) : null}
    </>
  )
}

export default GenerationNoMemberFields
