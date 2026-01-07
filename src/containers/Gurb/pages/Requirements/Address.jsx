import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { buttonGurbDark } from '../../../../containers/Gurb/gurbTheme'

import InputField from '../../../../components/InputField'
import LocationInput from '../../../../containers/Gurb/components/AddressAutocompletedFieldGurb'
import TextRecomendation from '../../components/TextRecomendation'

import {
  useHandleChange,
  useHandleChangeInteger
} from '../../../../hooks/useHandleChange'
import { useAddressHandlers } from '../../../../hooks/useGurbAddressHandlers'

const AddressField = ({
  addressFieldName = 'address',
  values,
  errors,
  setFieldError,
  touched,
  setFieldValue,
  setFieldTouched,
  setTouched
}) => {
  const { t } = useTranslation()
  const { gurbCode } = useParams()
  const sessionTokenRef = useRef()

  // Use the custom hook for address logic
  const {
    loading,
    handleChangeStreet,
    handleChangePostalCode,
    handleChangeNumber,
    handleAddressValidation
  } = useAddressHandlers({
    setFieldValue,
    setFieldError,
    setTouched,
    addressFieldName,
    values,
    t,
    sessionTokenRef,
    gurbCode
  })

  // Local generic change handlers
  const handleChange = useHandleChange(setFieldValue)
  const handleChangeInteger = useHandleChangeInteger(setFieldValue)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextRecomendation
          title={t('GURB_ADDRESS_TITLE')}
          text={t('GURB_ADDRESS_TITLE_HELPER')}
        />
      </Grid>

      {/* Street Input */}
      <Grid item xs={12}>
        <LocationInput
          textFieldName={t('GURB_ADDRESS_STREET')}
          value={values[addressFieldName]?.street}
          onChange={handleChangeStreet}
          onBlur={() => setFieldTouched(`${addressFieldName}.street`, true)}
          error={
            touched[addressFieldName]?.street &&
            errors[addressFieldName]?.street
              ? errors[addressFieldName].street
              : false
          }
          touched={touched[addressFieldName]?.street}
          sessionTokenRef={sessionTokenRef}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          {/* Postal Code Input */}
          <Grid item sm={6} xs={12}>
            <InputField
              name="postal_code"
              handleBlur={() =>
                setFieldTouched(`${addressFieldName}.postal_code`, true)
              }
              textFieldName={t('POSTAL_CODE')}
              handleChange={handleChangePostalCode}
              touched={touched[addressFieldName]?.postal_code}
              value={values[addressFieldName].postal_code}
              error={
                touched[addressFieldName]?.postal_code &&
                errors[addressFieldName]?.postal_code
                  ? t(errors[addressFieldName].postal_code)
                  : ''
              }
              required
            />
          </Grid>

          {/* Number Input */}
          <Grid item sm={6} xs={12}>
            <InputField
              name="number"
              handleBlur={() =>
                setFieldTouched(`${addressFieldName}.number`, true)
              }
              textFieldName={t('NUMBER')}
              textFieldHelper={t('HELPER_NUMBER_ADDRESS')}
              handleChange={handleChangeNumber}
              touched={touched[addressFieldName]?.number}
              value={values[addressFieldName]?.number}
              error={
                touched[addressFieldName]?.number &&
                errors[addressFieldName]?.number
                  ? t(errors[addressFieldName].number)
                  : ''
              }
              required
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Validate Button */}
      <Grid
        item
        sm={12}
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
        <Button
          tabIndex={0}
          sx={{
            ...buttonGurbDark,
            height: '40px',
            padding: '10px 48px',
            boxSizing: 'border-box',
            lineHeight: 1,
            textTransform: 'none',
            width: 'auto',
            alignSelf: 'center',
            marginTop: {
              xs: '1rem',
              sm: '2rem'
            }
          }}
          variant="contained"
          disabled={loading || values[addressFieldName]?.inside_perimeter}
          onClick={handleAddressValidation}
          data-cy="validate-address">
          {t('GURB_ADDRESS_VALIDATION_BUTTON_TEXT')}
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddressField
