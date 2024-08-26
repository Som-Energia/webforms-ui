import React, { useState, useEffect, useCallback } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import VATField from '../../../components/VATField'
import { checkIsPostalCodeFromGenerationEnabledZone } from '../../../services/api'

const customStyles = {
  title: {
    fontSize: '1rem',
    marginTop: '16px',
    fontWeight: 500
  },
  titleWithMargin: {
    mb: 1
  },
  titleWithMarginPlus: {
    mb: 3
  },
  helperText: {
    color: "#f44336",
    marginRight: "14px",
    fontSize: "0.75rem",
    marginTop: "3px",
    textAlign: "left",
    lineHeight: "1.66",
    letterSpacing: "0.03333em",
    fontWeight: 400
  }
}

const GenerationNoMemberIdFields = (props) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const {
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    setErrors,
    setValues,
    setFieldTouched,
    isTesting = false
  } = props

  const onChangeVAT = (params) => {
    const { vat, isPhisical, valid, isMember } = params
    const tmpValues = {
      ...values,
      member: {
        ...values.member,
        isphisical: isPhisical,
        vatvalid: valid,
        exists:isMember,
        vat: vat
      }
    }
    setValues(tmpValues)
    if(!touched?.member?.vat){
      setFieldTouched('member.vat',true)  
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
      const tmpValues = {
        ...values,
        member: {
          ...values.member,
          generation_zone_checked: true,
          has_generation_enabled_zone: result.data,
          postal_code_checked:true
        }
      }
      setValues(tmpValues)

      setIsLoading(false)
    } catch (error) {
      setErrors({
        member: {
          postal_code: t(
            'GENERATION_FORM_DATA_COULD_NOT_BE_VALIDATED'
          )
        }
      })
      setIsLoading(false)
    }
  }, [values?.member?.postal_code, setFieldValue, setErrors, t])

  useEffect(() => {
    if (values?.member?.postal_code?.length === 5 && !isTesting) {
      checkPostalCode()
    }
  }, [checkPostalCode, values?.member?.postal_code])

  return (
    <>
      <Box id="box_no_member_identifier" mt={0} mb={2}>
        <Typography
          variant="h6"
          sx={[customStyles.title, customStyles.titleWithMarginPlus]}
          dangerouslySetInnerHTML={{
            __html: t('GENERATION_FORM_POSTAL_CODE')
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
              touched?.member?.postal_code && errors?.member?.postal_code ? <Typography
                variant="h6"
                sx={customStyles.helperText}
                dangerouslySetInnerHTML={{
                  __html: errors?.member?.postal_code
                }}
              /> : ""
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
              sx={[customStyles.title, customStyles.titleWithMarginPlus]}
              dangerouslySetInnerHTML={{
                __html: t('GENERATION_FORM_CONTRIBUTION_MEMBER_VAT')
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

export default GenerationNoMemberIdFields
