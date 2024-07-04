import React from 'react'

import { useTranslation } from 'react-i18next'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import StepHeader from '../../components/StepHeader'
import Chooser from '../../components/Chooser'
import MemberIdentifierFields from '../../components/MemberIdentifierFields'
import VATField from '../../components/VATField'

const MemberIdentifier = (props) => {
  const { t } = useTranslation()

  const {
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    resetForm,
    title = t('CONTRIBUTION')
  } = props

  const handleChooser = (event) => {
    resetForm()
    setFieldValue('member.is_member', !!event?.option)
  }

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

  return (
    <>
      <StepHeader title={title} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: t('CONTRIBUTION_MEMBER_IDENTIFIER_DESC')
        }}
      />
      <Box pt={0} mb={1}>
        <Chooser
          question={t('CONTRIBUTION_MEMBER_QUESTION')}
          onChange={handleChooser}
          condensed={true}
          value={values?.member?.is_member}
          canBeEmpty={false}
          options={[
            {
              value: true,
              label: t('CONTRIBUTION_MEMBER_YES'),
              id: 'member_choose_yes'
            },
            {
              value: false,
              label: t('CONTRIBUTION_MEMBER_NO'),
              id: 'member_choose_no'
            }
          ]}
        />
      </Box>

      {values?.member?.is_member ? (
        <Box id="box_member_identifier" mt={0} mb={2}>
          <Typography
            variant="h6"
            sx={{ fontSize: '1rem', mt: '16px', fontWeight: 500, mb: 1 }}
            dangerouslySetInnerHTML={{
              __html: t('CONTRIBUTION_MEMBER_INDENTIFIER')
            }}
          />

          <MemberIdentifierFields {...props} />
        </Box>
      ) : (
        <>
          <Box id="box_no_member_identifier" mt={0} mb={2}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                mt: '16px',
                fontWeight: 500,
                mb: 3
              }}
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
                  __html: t('CONTRIBUTION_MEMBER_WARNING')
                }}
              />
            </Alert>
          </Box>
        </>
      )}
    </>
  )
}

export default MemberIdentifier
