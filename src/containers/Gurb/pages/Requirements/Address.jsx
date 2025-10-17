import { useRef, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { buttonGurbDark } from '../../../../containers/Gurb/gurbTheme'

import * as Yup from 'yup'

import {
  useHandleChange,
  useHandleChangeInteger
} from '../../../../hooks/useHandleChange'

import { addressValidations } from '../../../../containers/Gurb/requirementsValidations'
import InputField from '../../../../components/InputField'
import LocationInput from '../../../../containers/Gurb/components/AddressAutocompletedFieldGurb'
import {
  searchPlace,
  getPlaceDetails
} from '../../../../services/googleApiClient'
import { checkGurbDistance } from '../../../../services/apiGurb'

import PopUpContext from '../../../../context/PopUpContext'
import TextRecomendation from '../../components/TextRecomendation'

import { buildGurbDialog } from '../../../../containers/Gurb/utils/buildGurbDialog'

const normalizePlace = (place) => ({
  id: place?.id?.toString() || '',
  name: place?.name || ''
})

// Handle Gurb distance
const handleCheckGurbDistance = async (
  gurbCode,
  lat,
  long,
  setFieldValue,
  addressFieldName
) => {
  const { data } = await checkGurbDistance(gurbCode, lat, long)

  if (data?.error) {
    console.error('Error checking distance to Gurb:', data.error)
    throw new Error(data.error)
  }

  if (!data) {
    throw new GurbOutOfPerimeterError(
      'The address is out of the allowed range for this GURB'
    )
  }

  setFieldValue(`${addressFieldName}.inside_perimeter`, true)
}

const getLatLongWithFullAddress = async (
  setFieldValue,
  values,
  addressFieldName,
  sessionTokenRef,
  currentNumber
) => {
  try {
    const address = values[addressFieldName]

    // 1. Get place details using the persistent ID
    const place = await getPlaceDetails(address.id, sessionTokenRef)

    const postalCodeComp = place.addressComponents.find((c) =>
      c.types.includes('postal_code')
    )
    const streetComp = place.addressComponents.find((c) =>
      c.types.includes('route')
    )

    // 2. Build full address string
    const fullAddress = `${streetComp?.longText || ''} ${
      currentNumber || ''
    }, ${postalCodeComp?.longText || ''}`

    // 3. Search for that address
    const suggestions = await searchPlace(fullAddress, sessionTokenRef)
    if (suggestions.length === 0) return

    // 4. Get suggested place details
    const suggestedPlace = await getPlaceDetails(
      suggestions[0].id,
      sessionTokenRef
    )

    // 5. Update Formik with lat/long
    await setFieldValue(
      `${addressFieldName}.lat`,
      suggestedPlace.location.lat()
    )
    await setFieldValue(
      `${addressFieldName}.long`,
      suggestedPlace.location.lng()
    )
  } catch (error) {
    console.error('Error updating address values:', error)
  }
}

class GurbOutOfPerimeterError extends Error {
  constructor(message) {
    super(message)
    this.name = 'GurbOutOfPerimeterError'
  }
}

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
  const sessionTokenRef = useRef()
  const [loading, setLoading] = useState(false)
  const { gurbCode } = useParams()
  const { setContent } = useContext(PopUpContext)

  const handleChangeStreet = async (addressValue) => {
    await setFieldValue(`${addressFieldName}.inside_perimeter`, false)

    if (!addressValue || !addressValue.id) {
      await setFieldValue(
        `${addressFieldName}.street`,
        addressValue?.street || addressValue?.text || ''
      )
      return
    }

    try {
      await setFieldValue(`${addressFieldName}.id`, addressValue.id || '')
      const place = await getPlaceDetails(addressValue.id, sessionTokenRef)
      const streetComponent = place.addressComponents.find((c) =>
        c.types.includes('route')
      )
      const postalCodeComponent = place.addressComponents.find((c) =>
        c.types.includes('postal_code')
      )

      const newStreet = streetComponent?.longText || ''
      const newPostalCode = postalCodeComponent?.longText || ''

      await setFieldValue(`${addressFieldName}.street`, newStreet)
      await setFieldValue(`${addressFieldName}.postal_code`, newPostalCode)

      const freshAddress = {
        ...values[addressFieldName],
        id: addressValue.id,
        street: newStreet,
        postal_code: newPostalCode,
        number: values[addressFieldName]?.number
      }

      await getLatLongWithFullAddress(
        setFieldValue,
        { [addressFieldName]: freshAddress },
        addressFieldName,
        sessionTokenRef,
        freshAddress.number
      )
    } catch (error) {
      console.error('Error fetching place details:', error)
      await setFieldValue(
        `${addressFieldName}.street`,
        addressValue.text || addressValue.street || ''
      )
      await setFieldValue(`${addressFieldName}.postal_code`, '')
    }
  }

  const handleChangePostalCode = async (event) => {
    const value = event.target.value
    await setFieldValue(`${addressFieldName}.postal_code`, value)
    await setFieldValue(`${addressFieldName}.inside_perimeter`, false)
    await getLatLongWithFullAddress(
      setFieldValue,
      values,
      addressFieldName,
      sessionTokenRef,
      values[addressFieldName]?.number
    )
  }

  const handleChangeNumber = async (event) => {
    const cleanedNumber = event.target.value.replace(/[^0-9]/g, '')
    await setFieldValue(`${addressFieldName}.number`, cleanedNumber)
    if (cleanedNumber) {
      await setFieldValue(`${addressFieldName}.inside_perimeter`, false)
      getLatLongWithFullAddress(
        setFieldValue,
        values,
        addressFieldName,
        sessionTokenRef,
        cleanedNumber
      )
    } else {
      await setFieldValue(`${addressFieldName}.lat`, undefined)
      await setFieldValue(`${addressFieldName}.long`, undefined)
    }
  }

  const handleChange = useHandleChange(setFieldValue)

  const handleChangeInteger = useHandleChangeInteger(setFieldValue)

  const handleClick = async () => {
    const updates = { address: {} }
    try {
      await addressValidations.validate(values, { abortEarly: false })
      setLoading(true)
      await handleCheckGurbDistance(
        gurbCode,
        values[addressFieldName]?.lat,
        values[addressFieldName]?.long,
        setFieldValue,
        addressFieldName
      )
    } catch (err) {
      // Handle YUP validation errors
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((e) => {
          if (!e.path) return
          setFieldError(e.path, e.message)
          const keyPattern = e.path.split('.')[1]
          updates.address[keyPattern] = true
        })
        setTouched(updates)
      }
      // Handle lat/long missing errors
      if (updates?.address?.lat || updates?.address?.long) {
        console.error('Lat and Long are required to check Gurb distance')
        updates.address.inside_perimeter = false
        setFieldValue(`${addressFieldName}.inside_perimeter`, false)
        setContent(
          buildGurbDialog({
            severity: 'error',
            setContent: setContent,
            titleKey: t('GURB_ADDRESS_ERROR_UNEXPECTED'),
            text1Key: t('GURB_ADDRESS_ERROR_MISSING_LONGLAT_MAIN_TEXT')
          })
        )
      } else if (err instanceof GurbOutOfPerimeterError) {
        setFieldValue(`${addressFieldName}.inside_perimeter`, false)
        setContent(
          buildGurbDialog({
            severity: 'error',
            setContent: setContent,
            titleKey: t('GURB_ADDRESS_ERROR_OUT_OF_PERIMETER_TITLE_TEXT'),
            text1Key: t('GURB_ADDRESS_ERROR_OUT_OF_PERIMETER_MAIN_TEXT'),
            text2Key: t('GURB_ADDRESS_ERROR_OUT_OF_PERIMETER_SECONDARY_TEXT')
          })
        )
      } else {
        console.error('Error validating perimeter address:', err)
        setContent(
          buildGurbDialog({
            severity: 'error',
            setContent: setContent,
            titleKey: t('GURB_ADDRESS_ERROR_UNEXPECTED'),
            text1Key: t('GURB_ADDRESS_ERROR_UNEXPECTED_MAIN_TEXT')
          })
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextRecomendation
          title={t('GURB_ADDRESS_TITLE')}
          text={t('GURB_ADDRESS_TITLE_HELPER')}
        />
      </Grid>

      <Grid item sm={8} xs={12}>
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

      <Grid item sm={4} xs={12}>
        <InputField
          name={'postal_code'}
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

      <Grid item sm={4} xs={12}>
        <InputField
          name={'number'}
          handleBlur={() => setFieldTouched(`${addressFieldName}.number`, true)}
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

      <Grid item sm={2} xs={6}>
        <InputField
          name={'floor'}
          textFieldName={t('FLOOR')}
          handleChange={handleChangeInteger}
          touched={touched[addressFieldName]?.floor}
          value={values[addressFieldName]?.floor}
          error={errors[addressFieldName]?.floor}
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={'door'}
          textFieldName={t('DOOR')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.door}
          value={values[addressFieldName]?.door}
          error={errors[addressFieldName]?.door}
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={'stairs'}
          textFieldName={t('STAIRS')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.stairs}
          value={values[addressFieldName]?.stairs}
          error={errors[addressFieldName]?.stairs}
        />
      </Grid>

      <Grid item sm={2} xs={6}>
        <InputField
          name={'bloc'}
          textFieldName={t('BLOCK')}
          handleChange={handleChange}
          touched={touched[addressFieldName]?.bloc}
          value={values[addressFieldName]?.bloc}
          error={errors[addressFieldName]?.bloc}
        />
      </Grid>

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
            padding: '13px 18px',
            boxSizing: 'border-box',
            lineHeight: 1,
            textTransform: 'none',
            width: 'auto',
            alignSelf: 'center'
          }}
          variant="contained"
          disabled={loading || values[addressFieldName]?.inside_perimeter}
          onClick={handleClick}
          data-cy="validate-address">
          {t('GURB_ADDRESS_VALIDATION_BUTTON_TEXT')}
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddressField
