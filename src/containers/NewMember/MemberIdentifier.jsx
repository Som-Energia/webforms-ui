import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import InputField from '../Gurb/components/InputField'
import {
  handleInputNif,
  handleInputNifBlur,
  handleCheckNifFormat
} from '../../utils/commonHandles'

const MemberIdentifier = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched
  } = props
  const { t } = useTranslation()

  useEffect(() => {
    if (values?.new_member?.nif && values?.new_member?.nif.length === 9) {
      handleCheckNifFormat(
        values.new_member.nif,
        setFieldError,
        'new_member.nif'
      )
    }
  }, [values.new_member.nif])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3">
          {'Indica el NIF de la nova persona sòcia'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <InputField
          name="vat"
          textFieldLabel={t('GURB_NIF_LABEL')}
          textFieldName={t('GURB_NIF_FIELD')}
          textFieldHelper={t('GURB_NIF_HELPER')}
          iconHelper={true}
          handleChange={(event) => {
            handleInputNif(event, setFieldValue, 'new_member.nif')
          }}
          handleBlur={(event) => {
            handleInputNifBlur(setFieldTouched, 'new_member.nif')
          }}
          touched={touched?.new_member?.nif}
          value={values?.new_member.nif}
          error={errors?.new_member?.nif}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {
            'Si no disposes de NIE i tens passaport, ens pots enviar un correu a info@somenergia.coop amb les dades de la nova persona sòcia (nom, cognoms, passaport adjunt, correu electrònic, adreça i telèfon de contacte) i dades IBAN de pagament.'
          }
        </Typography>
      </Grid>
    </Grid>
  )
}

export default MemberIdentifier
