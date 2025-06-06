import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import LocationInput from '../containers/Gurb/components/AddressAutocompletedField'
import {
  useHandleChange,
  useHandleChangeInteger
} from '../hooks/useHandleChange'

import { getPlaceDetails } from '../services/googleApiClient'
import { getMunicipisByPostalCode } from '../services/api'
import InputField from './InputField'

const AddressField = (props) => {
  const {
    addressFieldName = 'address',
    addressLabel,
    values,
    errors,
    touched,
    setFieldValue,
    setValues
  } = props

  const { t } = useTranslation()

  const handleChange = useHandleChange(setFieldValue)
  const handleChangeInteger = useHandleChangeInteger(setFieldValue)

  const [addressValue, setAddressValue] = useState(
    values[addressFieldName] || {}
  )
  const [numberValue, setNumberValue] = useState(
    values[addressFieldName]?.number || ''
  )
  const [postalCodeValue, setPostalCodeValue] = useState(
    values[addressFieldName]?.postal_code || ''
  )
  const sessionTokenRef = useRef()


  useEffect(() => {
    setPostalCodeValue(values[addressFieldName]?.postal_code || '')
  }, [values[addressFieldName]?.postal_code])

  const updateAddressValues = async () => {
    try {
      const place = await getPlaceDetails(addressValue.id, sessionTokenRef)
      const postalCodeComponent = place.addressComponents.find((component) =>
        component.types.includes('postal_code')
      )
      const municipis = await getMunicipisByPostalCode(postalCodeComponent?.longText)
      const streetComponent = place.addressComponents.find((component) =>
        component.types.includes('route')
      )

      const updatedValues = { ...values }
      updatedValues[addressFieldName] = {
        ...values[addressFieldName],
        id: addressValue.id,
        text: addressValue.text,
        number: numberValue,
        postal_code: postalCodeComponent?.longText || '',
        street: streetComponent?.longText || '',
        state: municipis?.[0]?.[0]?.provincia || {},
        city: municipis?.[0]?.[0]?.municipi || {}
      }
      setValues(updatedValues)
    } catch (error) {
      console.log(error)
    }
  }

  const cleanAddress = () => {
    setFieldValue(addressFieldName, {
      has_different_address: values[addressFieldName]?.has_different_address || false,
      street: '',
      number: '',
      postal_code: '',
      state: { id: '', name: '' },
      city: { id: '', name: '' }
    })
  }

  const handleAddressChange = async (value) => {
    setAddressValue(value || {})

    if (!value || !value.id) {
      // Is a text is written, and no suggestion selected, the text is saved as street
      setFieldValue(`${addressFieldName}.street`, value?.street || value?.text || '')
      setFieldValue(`${addressFieldName}.postal_code`, '')
      return
    }

    try {
      // When a suggestion is selected, only street is written
       const place = await getPlaceDetails(value.id, sessionTokenRef)

      const streetComponent = place.addressComponents.find((component) =>
        component.types.includes('route')
      )
      const postalCodeComponent = place.addressComponents.find((component) =>
        component.types.includes('postal_code')
      )

      setFieldValue(`${addressFieldName}.street`, streetComponent?.longText || '')
      setFieldValue(`${addressFieldName}.postal_code`, postalCodeComponent?.longText || '')
    } catch (error) {
      console.error('Error fetching place details:', error)
      setFieldValue(`${addressFieldName}.street`, value.text || value.street || '')
      setFieldValue(`${addressFieldName}.postal_code`, '')
    }
  }
  const handleChangePostalCode = (event) => {
    const value = event.target.value
    setPostalCodeValue(value)
    setFieldValue(`${addressFieldName}.postal_code`, value)
  }

  const handleChangeNumber = (event) => {
    let cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setNumberValue(cleanedValue)
    setFieldValue(`${addressFieldName}.number`, cleanedValue)
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        <LocationInput
          id={addressFieldName}
          textFieldLabel={t('GURB_ADDRESS_LABEL')}
          textFieldName={addressLabel}
          value={values[addressFieldName]}
          onChange={handleAddressChange}
          sessionTokenRef={sessionTokenRef}
          required={true}
        />
      </Grid>

      <Grid item sm={4} xs={12}>
        <InputField
          name={`${addressFieldName}.postal_code`}
          textFieldName={t('POSTAL_CODE')}
          handleChange={handleChangePostalCode}
          touched={touched[addressFieldName]?.postal_code}
          value={postalCodeValue}
          error={errors[addressFieldName]?.postal_code}
          required={true}
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
          handleChange={handleChange}
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
