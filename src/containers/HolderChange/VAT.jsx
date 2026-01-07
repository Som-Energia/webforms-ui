import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'

import StepHeader from '../../components/StepHeader'
import VATField from '../../components/VATField'

function VAT(props) {
  const {
    values,
    setValues,
    touched,
    setFieldTouched,
    errors
  } = props
  const { t } = useTranslation()


  const onChangeVAT = ({ vat, isPhisical, valid, isMember }) => {
    const tmpValues = {
      ...values,
      holder: {
        ...values.holder,
        vat: vat,
        isphisical: isPhisical,
        vatvalid: valid,
        ismember: isMember
      }
    }
    setValues(tmpValues)
  }

  return (
    <>
      <StepHeader title={t('HOLDER_CHANGE')} />
      <Box className="step-body">
        <Box dangerouslySetInnerHTML={{ __html: t('FILL_VAT') }} />
        <Box mt={3} mb={1}>
          <VATField
            id="vat"
            name="holder.vat"
            label={t('VAT_HOLDERCHANGE_LABEL')}
            variant="outlined"
            fullWidth
            required
            isVatTouched={touched?.holder?.vat}
            setFieldTouched={setFieldTouched}
            autoFocus={false}
            onChange={onChangeVAT}
            {...props}
            value={values?.holder?.vat}
            error={
              (errors?.holder?.vat && touched?.holder?.vat) ||
              (touched?.holder?.vat && values?.holder?.vatvalid === false)
            }
            helperText={
              (touched?.holder?.vat && errors?.holder?.vat) ||
              (touched?.holder?.vat && errors?.holder?.vatvalid)
            }
          />
        </Box>
        <Box mt={4} mb={3}>
          <FormHelperText
            dangerouslySetInnerHTML={{
              __html: t('NO_VAT_HELP')
            }}></FormHelperText>
        </Box>
      </Box>
    </>
  )
}

export default VAT
