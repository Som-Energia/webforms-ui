import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

import StepHeader from '../../components/StepHeader'
import VATField from '../../components/VATField'

function VAT (props) {
  const { values, setValues, handleBlur, setFieldTouched, touched, errors } = props
  const { t } = useTranslation()

  const onChangeVAT = ({ vat, isPhisical, valid }) => {

    const tmpValues = {
      ...values,
      member: {
        ...values.member,
        vat:vat,
        isphisical:isPhisical,
        vatvalid: valid
      }
    }
    setValues(tmpValues)
    if(!touched?.member?.vat){
      setFieldTouched('member.vat',true)  
    }
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
          error={((errors?.member?.vat || errors?.member?.vatvalid) && touched?.member?.vat) ||
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
