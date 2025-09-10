import { useContext, useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'

import TextRecomendation from '../../components/TextRecomendation'
import LocationInput from '../../components/AddressAutocompletedField'
import InputField from '../../../../components/InputField'
import GurbErrorContext from '../../../../context/GurbErrorContext'
import { getPlaceDetails, searchPlace } from '../../../../services/googleApiClient'
import { getMunicipisByPostalCode } from '../../../../services/api'
import { checkGurbDistance } from '../../../../services/apiGurb'

const Address = ({ values, errors, touched, setFieldValue, setValues }) => {
  const { t } = useTranslation()
  const { setError, setErrorInfo } = useContext(GurbErrorContext)

  const [addressString, setAddressString] = useState(values.address.street)
  const [number, setNumber] = useState(values.address.number || '')
  const [isLoading, setIsLoading] = useState(false)
  const sessionTokenRef = useRef()

  // Store the selected address object here
  const selectedAddressRef = useRef(null)

  // Update full address including coordinates
  const updateFullAddressWithNumber = async (addressObj, numberValue) => {
    if (!addressObj?.id || !numberValue) return
    setIsLoading(true)
    try {
      const place = await getPlaceDetails(addressObj.id, sessionTokenRef)
      const postalCodeComp = place.addressComponents.find(c =>
        c.types.includes('postal_code')
      )
      const streetComp = place.addressComponents.find(c =>
        c.types.includes('route')
      )

      const fullAddress = `${streetComp?.longText || ''} ${numberValue}, ${postalCodeComp?.longText || ''}`
      const suggestions = await searchPlace(fullAddress, sessionTokenRef)

      if (suggestions.length > 0) {
        const suggestedPlace = await getPlaceDetails(suggestions[0].id, sessionTokenRef)
        const municipis = postalCodeComp?.longText
          ? await getMunicipisByPostalCode(postalCodeComp.longText)
          : null

        setValues(prev => ({
          ...prev,
          address: {
            ...prev.address,
            number: numberValue,
            street: streetComp?.longText || '',
            postal_code: postalCodeComp?.longText || '',
            lat: suggestedPlace.location.lat(),
            long: suggestedPlace.location.lng(),
            state: municipis?.[0]?.[0]?.provincia || { id: '', name: '' },
            city: municipis?.[0]?.[0]?.municipi || { id: '', name: '' }
          }
        }))
      }
    } catch (error) {
      console.error('Error updating full address:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Gurb distance
  const handleCheckGurbDistance = async () => {
    if (!values.address.lat || !values.address.long) return
    const gurbId = 2
    try {
      const { data } = await checkGurbDistance(gurbId, values.address.lat, values.address.long)
      if (!data) {
        setError(true)
        setErrorInfo({
          main_text: t('GURB_ADDRESS_ERROR_MAIN_TEXT'),
          seconday_text: t('GURB_ADDRESS_ERROR_SECONDARY_TEXT'),
          link_text: t('GURB_ADDRESS_ERROR_LINK_TEXT'),
          error_type: 'error',
          clean_field: () => initializeAddress()
        })
      }
    } catch (error) {
      console.error('Error checking Gurb distance:', error)
    }
  }

  useEffect(() => {
    if (values.address.lat && values.address.long) {
      handleCheckGurbDistance()
    }
  }, [values.address.lat, values.address.long])

  const initializeAddress = () => {
    setFieldValue('address', {
      street: '',
      number: '',
      lat: undefined,
      long: undefined,
      postal_code: '',
      state: { id: '', name: '' },
      city: { id: '', name: '' }
    })
    setAddressString('')
    setNumber('')
    selectedAddressRef.current = null
  }

  // When selecting an address
  const handleAddressChange = async (value) => {
    setAddressString(value)
    selectedAddressRef.current = value

    if (!value?.id) return

    try {
      const place = await getPlaceDetails(value.id, sessionTokenRef)
      const postalCodeComp = place.addressComponents.find(c =>
        c.types.includes('postal_code')
      )
      const streetComp = place.addressComponents.find(c =>
        c.types.includes('route')
      )

      // Update basic address info
      setValues(prev => ({
        ...prev,
        address: {
          ...prev.address,
          street: streetComp?.longText || '',
          postal_code: postalCodeComp?.longText || ''
        }
      }))

      // If number already exists, update full address with coordinates
      if (number) {
        await updateFullAddressWithNumber(value, number)
      }
    } catch (error) {
      console.error('Error getting place details:', error)
    }
  }

  // When typing the number
  const handleNumberChange = async (event) => {
    const cleanedNumber = event.target.value.replace(/[^0-9]/g, '')
    setNumber(cleanedNumber)
    setFieldValue('address.number', cleanedNumber)

    if (selectedAddressRef.current && cleanedNumber) {
      await updateFullAddressWithNumber(selectedAddressRef.current, cleanedNumber)
    } else if (!cleanedNumber) {
      setFieldValue('address.lat', undefined)
      setFieldValue('address.long', undefined)
    }
  }

  const handleChangeInteger = (event) => {
    const cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue(event.target.name, cleanedValue)
  }

  const handleChange = (event) => {
    setFieldValue(event.target.name, event.target.value)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextRecomendation
          title={t('GURB_ADDRESS_TITLE')}
          text={t('GURB_ADDRESS_TITLE_HELPER')}
        />
      </Grid>

      <Grid item xs={12}>
        <LocationInput
          required
          textFieldName={t('GURB_ADDRESS_FIELD')}
          textFieldHelper={t('GURB_ADDRESS_HELPER')}
          id="address-street"
          name="address.street"
          value={addressString}
          onChange={handleAddressChange}
          sessionTokenRef={sessionTokenRef}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <InputField
          name="address.number"
          textFieldName={t('NUMBER')}
          handleChange={handleNumberChange}
          touched={touched?.address?.number}
          value={number}
          error={errors?.address?.number}
          required
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6} sm={2}>
        <InputField
          name="address.floor"
          textFieldName={t('FLOOR')}
          handleChange={handleChangeInteger}
          touched={touched?.address?.floor}
          value={values?.address?.floor}
          error={errors?.address?.floor}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6} sm={2}>
        <InputField
          name="address.door"
          textFieldName={t('DOOR')}
          handleChange={handleChange}
          touched={touched?.address?.door}
          value={values?.address?.door}
          error={errors?.address?.door}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6} sm={2}>
        <InputField
          name="address.stairs"
          textFieldName={t('STAIRS')}
          handleChange={handleChange}
          touched={touched?.address?.stairs}
          value={values?.address?.stairs}
          error={errors?.address?.stairs}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6} sm={2}>
        <InputField
          name="address.bloc"
          textFieldName={t('BLOCK')}
          handleChange={handleChange}
          touched={touched?.address?.bloc}
          value={values?.address?.bloc}
          error={errors?.address?.bloc}
          disabled={isLoading}
        />
      </Grid>

      {isLoading && (
        <Grid item xs={12}>
          <p>{t('LOADING_ADDRESS_DATA')}</p>
        </Grid>
      )}
    </Grid>
  )
}

export default Address
