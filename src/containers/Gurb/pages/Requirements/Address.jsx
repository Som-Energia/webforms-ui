import { useContext, useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import LocationInput from '../../components/AddressAutocompletedField'
import { setMunicipisWithPostalCode } from '../../../../services/utils'
import { checkGurbDistance } from '../../../../services/apiGurb'
import GurbErrorContext from '../../../../context/GurbErrorContext'
import Box from '@mui/material/Box'
import InputField from '../../components/InputField'
import { getPlaceDetails, searchPlace } from '../../../../services/googleApiClient'


const Address = (props) => {
  const { t } = useTranslation()
  const { values, errors, touched, setFieldValue, setFieldTouched, setValues } = props
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  const [addressValue, setAddressValue] = useState(values.address.street)
  const sessionTokenRef = useRef()

  useEffect(() => {
    const postalCode = values.address.postal_code
    if (postalCode?.length > 4) {
      setMunicipisWithPostalCode(postalCode, setFieldValue, 'address', values)
    }
  }, [values.address.postal_code])

  const updateAddressValues = async () => {
    getPlaceDetails(addressValue.id, sessionTokenRef)
      .then((place) => {
        const postalCode = place.addressComponents.find(component =>
          component.types.includes('postal_code')
        );
        const street = place.addressComponents.find(component =>
          component.types.includes('route')
        );
        const fullAddress = place.formattedAddress.replace(/,/, ` ${values.address.number},`)
        searchPlace(fullAddress, sessionTokenRef)
          .then((suggestions) => {
            if (suggestions.length > 0) {
              getPlaceDetails(suggestions[0].id, sessionTokenRef)
                .then((place) => {
                  const updatedValues = {
                    ...values,
                    address: {
                      ...values.address,
                      lat: place.location.lat(),
                      long: place.location.lng(),
                      postal_code: postalCode.longText,
                      street: street.longText,
                    }
                  }
                  setValues(updatedValues)
                })
                .catch((error) => {
                  console.log(error)
                })
            }
            else {
              console.log("Address not found")
            }
          })
          .catch((error) => {
            console.log(error)
          })

      }).catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (addressValue && values.address.number) {
      updateAddressValues()
    }
  }, [addressValue, values.address.number])

  const handleCheckGurbDistance = async () => {
    // TODO: waiting to know where gurb id comes from
    const gurbId = 3
    await checkGurbDistance(gurbId, values.address.lat, values.address.long)
      .then(({ data }) => {
        // data is false when address is outside gurb's 2km limit
        if (data === false) {
          setError(true)
          setErrorInfo({
            main_text: t('GURB_ADDRESS_ERROR_MAIN_TEXT'),
            seconday_text: t('GURB_ADDRESS_ERROR_SECONDARY_TEXT'),
            link_text: t('GURB_ADDRESS_ERROR_LINK_TEXT'),
            error_type: 'error',
            clean_field: () => {
              initializeAddress()
            }
          })
        }
      })
      .catch((error) => {
        // TODO: handle errors
        console.log('ERROR:', error)
      })
  }

  useEffect(() => {
    if (values.address.lat !== undefined && values.address.long !== undefined) {
      handleCheckGurbDistance()
    }
  }, [values.address.lat, values.address.long])

  const handleAddressChange = (value) => {
    setAddressValue(value)
  }

  const initializeAddress = () => {
    setFieldValue('address', {
      street: '',
      number: '',
      lat: '',
      long: '',
      postal_code: '',
      state: { id: '', name: '' },
      city: { id: '', name: '' }
    })
  }

  const handleChangeInteger = (event) => {
    let cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue(event.target.name, cleanedValue)
  }

  const handleChange = (event) => {
    setFieldValue(event.target.name, event.target.value)
  }

  return (
    <>
      <TextRecomendation
        title={t('GURB_ADDRESS_TITLE')}
        text={t('GURB_ADDRESS_TITLE_HELPER')}
      />
      <LocationInput
        required
        textFieldLabel={t('GURB_ADDRESS_LABEL')}
        textFieldName={t('GURB_ADDRESS_FIELD')}
        textFieldHelper={t('GURB_ADDRESS_HELPER')}
        id="address-street"
        name="address.street"
        value={addressValue}
        onChange={handleAddressChange}
        sessionTokenRef={sessionTokenRef}
      />
      <Box sx={{ display: 'flex', gap: '2rem' }}>
        <Box>
          <InputField
            name={'address.number'}
            textFieldName={t('NUMBER')}
            handleChange={handleChangeInteger}
            touched={touched?.address?.number}
            value={values?.address?.number}
            error={errors?.address?.number}
            required={true}
          />
        </Box>
        <Box>
          <InputField
            name={'address.floor'}
            textFieldName={t('FLOOR')}
            handleChange={handleChangeInteger}
            touched={touched?.address?.floor}
            value={values?.address?.floor}
            error={errors?.address?.floor}
            required={false}
          />
        </Box>
        <Box>
          <InputField
            name={'address.door'}
            textFieldName={t('DOOR')}
            handleChange={handleChangeInteger}
            touched={touched?.address?.door}
            value={values?.address?.door}
            error={errors?.address?.door}
            required={false}
          />
        </Box>
        <Box>
          <InputField
            name={'address.stairs'}
            textFieldName={t('STAIRS')}
            handleChange={handleChange}
            touched={touched?.address?.stairs}
            value={values?.address?.stairs}
            error={errors?.address?.stairs}
            required={false}
          />
        </Box>
        <Box>
          <InputField
            name={'address.bloc'}
            textFieldName={t('BLOCK')}
            handleChange={handleChange}
            touched={touched?.address?.bloc}
            value={values?.address?.bloc}
            error={errors?.address?.bloc}
            required={false}
          />
        </Box>
      </Box>
    </>
  )
}
export default Address
