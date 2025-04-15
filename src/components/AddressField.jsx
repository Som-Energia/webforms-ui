import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import LocationInput from '../containers/Gurb/components/AddressAutocompletedField'
import { useHandleChange, useHandleChangeInteger } from '../hooks/useHandleChange'

import { getPlaceDetails } from '../services/googleApiClient'
import { getMunicipisByPostalCode } from '../services/api'
import InputField from './InputField'

const AddressField = (props) => {
  const {
    addressFieldName = 'address',
    addressLabel,
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched,
    setValues
  } = props

  const { t } = useTranslation()

  const handleChange = useHandleChange(setFieldValue)
  const handleChangeInteger = useHandleChangeInteger(setFieldValue)

  const [addressValue, setAddressValue] = useState(
    values[addressFieldName]?.street
  )
  const [numberValue, setNumberValue] = useState(
    values[addressFieldName]?.number
  )
  const sessionTokenRef = useRef()

  useEffect(() => {
    if (addressValue?.id && numberValue) {
      updateAddressValues()
    } else if (!addressValue || !numberValue) {
      cleanAddress()
    }
  }, [addressValue, numberValue])

  const updateAddressValues = async () => {
    try {
      const place = await getPlaceDetails(addressValue.id, sessionTokenRef)
      const postalCode = place.addressComponents.find((component) =>
        component.types.includes('postal_code')
      )
      const municipis = await getMunicipisByPostalCode(postalCode?.longText)
      const street = place.addressComponents.find((component) =>
        component.types.includes('route')
      )

      const updatedValues = { ...values }
      updatedValues[addressFieldName] = {
        ...values[addressFieldName],
        number: numberValue,
        postal_code: postalCode?.longText || '',
        street: street?.longText || '',
        state: municipis && municipis[0] ? municipis[0][0]?.provincia : {},
        city: municipis && municipis[0] ? municipis[0][0]?.municipi : {}
      }
      setValues(updatedValues)
    } catch (error) {
      console.log(error)
    }
  }

  const cleanAddress = () => {
    setFieldValue(addressFieldName, {
      has_different_address: values[addressFieldName].has_different_address,
      street: '',
      number: '',
      postal_code: '',
      state: { id: '', name: '' },
      city: { id: '', name: '' }
    })
  }

  const handleAddressChange = (value) => {
    setAddressValue(value)
  }

  const handleChangeNumber = (event) => {
    let cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setNumberValue(cleanedValue)
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={12} xs={12}>
        <LocationInput
          required
          textFieldLabel={t('GURB_ADDRESS_LABEL')}
          textFieldName={addressLabel}
          textFieldHelper={t('GURB_ADDRESS_HELPER')}
          id={`${addressFieldName}-street`}
          name={`${addressFieldName}.street`}
          value={addressValue}
          onChange={handleAddressChange}
          sessionTokenRef={sessionTokenRef}
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <InputField
          name={`${addressFieldName}.number`}
          textFieldName={t('NUMBER')}
          handleChange={handleChangeNumber}
          touched={touched[addressFieldName]?.number}
          value={numberValue}
          error={errors[addressFieldName]?.number}
          required={true}
        />
      </Grid>
      <Grid item sm={2} xs={6}>
        <InputField
          name={`${addressFieldName}.floor`}
          textFieldName={t('FLOOR')}
          handleChange={handleChangeInteger}
          touched={touched[addressFieldName]?.floor}
          value={values[addressFieldName]?.floor}
          error={errors[addressFieldName]?.floor}
          required={false}
        />
      </Grid>
      <Grid item sm={2} xs={6}>
        <InputField
          name={`${addressFieldName}.door`}
          textFieldName={t('DOOR')}
          handleChange={handleChangeInteger}
          touched={touched[addressFieldName]?.door}
          value={values[addressFieldName]?.door}
          error={errors[addressFieldName]?.door}
          required={false}
        />
      </Grid>
      <Grid item sm={2} xs={6}>
        <InputField
          name={`${addressFieldName}.stairs`}
          textFieldName={t('STAIRS')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.stairs}
          value={values[addressFieldName]?.stairs}
          error={errors[addressFieldName]?.stairs}
          required={false}
        />
      </Grid>
      <Grid item sm={2} xs={6}>
        <InputField
          name={`${addressFieldName}.bloc`}
          textFieldName={t('BLOCK')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.bloc}
          value={values[addressFieldName]?.bloc}
          error={errors[addressFieldName]?.bloc}
          required={false}
        />
      </Grid>
    </Grid>
  )
}
export default AddressField
