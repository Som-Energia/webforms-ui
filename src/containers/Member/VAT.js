import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

import StepHeader from '../../components/StepHeader'
import VATField from '../../components/VATField'

function VAT (props) {
  const { values, setFieldValue, setFieldTouched, handleBlur, touched, errors } = props
  const { t } = useTranslation()

  const onChangeVAT = ({ vat, isPhisical, valid }) => {
    setFieldValue('member.vat', vat)
    setFieldValue('member.isphisical', isPhisical)
    setFieldValue('member.vatvalid', valid)
    setFieldTouched('member.vat', true)
  }

  return (
    <>
      <StepHeader title={t('NEW_MEMBER')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('NEW_MEMBER_DESC') }}
      />
      <Box mt={3} mb={1}>
        <VATField
          id="vat"
          name="member.vat"
          label={t('VAT_LABEL')}
          variant="outlined"
          fullWidth
          required
          autoFocus={true}
          value={values?.member?.vat}
          onChange={onChangeVAT}
          onBlur={handleBlur}
          error={(errors?.member?.vat && touched?.member?.vat) ||
            (touched?.member?.vat && values?.member?.vatvalid === false)
          }
          helperText={(touched?.member?.vat && errors?.member?.vat) ||
            (touched?.member?.vat && errors?.member?.vatvalid)
          }
        />
      </Box>
      <Box mt={4} mb={3}>
        <FormHelperText dangerouslySetInnerHTML={{ __html: t('NEW_MEMBER_NO_VAT_HELP') }}></FormHelperText>
      </Box>
    </>
  )
}

export default VAT
