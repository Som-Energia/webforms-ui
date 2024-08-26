import React from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import VATField from '../../components/VATField'



const HolderIdentifier = (props) => {
  const { t } = useTranslation()
  const {
    values,
    handleBlur,
    setValues,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
  } = props

  const onChangeVAT = ({ vat, isPhisical, valid }) => {
    const tmpValues = {
      ...values,
      holder: {
        ...values.holder,
        vat: vat,
        isphisical: isPhisical,
        vatvalid: valid
      }
    }
    setValues(tmpValues)
    if(!touched?.holder?.vat){
      setFieldTouched('holder.vat',true)  
    }
  }

  const handleChangePreviousHolder = ({ option }) => {
    setFieldValue('holder.previous_holder', option)
  }

  return (
    <>
      <StepHeader title={t('HOLDER_IDENTIFIER_TITLE')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('HOLDER_IDENTIFIER_DESC') }}
      />
      <Box mt={3} mb={3}>
        <VATField
          id="vat"
          name="holder.vat"
          label={t('VAT_LABEL')}
          variant="outlined"
          fullWidth
          required
          autoFocus={true}
          value={values?.holder?.vat}
          onChange={onChangeVAT}
          onBlur={handleBlur}
          error={
            ((errors?.holder?.vat || errors?.holder?.vatvalid) && touched?.holder?.vat) ||
            (touched?.holder?.vat && values?.holder?.vatvalid === false)
          }
          helperText={
            (touched?.holder?.vat && errors?.holder?.vat) ||
            (touched?.holder?.vat && errors?.holder?.vatvalid)
          }
        />
      </Box>

      {values?.contract?.has_service !== false && (
        <Box mt={1} mb={1} sx={{
          '& h6': {
            fontSize: '1rem',
            mt: 2
          }
        }} >
          <Chooser
            question={t('PREVIOUS_HOLDER')}
            onChange={handleChangePreviousHolder}
            value={
              values.contract.has_service === false
                ? false
                : values.holder.previous_holder
            }
            disabled={
              values.holder.vatvalid !== true ||
              values.contract.has_service === false
            }
            options={[
              {
                id: 'previous-holder-yes',
                value: true,
                label: t('PREVIOUS_HOLDER_YES_LABEL'),
                description: t('PREVIOUS_HOLDER_YES_DESC')
              },
              {
                id: 'previous-holder-no',
                value: false,
                label: t('PREVIOUS_HOLDER_NO_LABEL'),
                description: t('PREVIOUS_HOLDER_NO_DESC')
              }
            ]}
          />
        </Box>
      )}
    </>
  )
}

export default HolderIdentifier
