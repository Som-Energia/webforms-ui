import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import LocationInput from '../../components/AddressAutocompletedField'
import { setMunicipisWithPostalCode } from '../../../../services/utils'
import { checkGurbDistance } from '../../../../services/apiGurb'
import GurbErrorContext from '../../../../context/GurbErrorContext'

const Address = (props) => {
  const { t } = useTranslation()
  const { values, errors, touched, setFieldValue, setFieldTouched } = props
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  const [addressValue, setAddressValue] = useState('')

  useEffect(() => {
    const postalCode = values.address.postal_code
    if (postalCode?.length > 4) {
      setMunicipisWithPostalCode(postalCode, setFieldValue, 'address', values)
    }
  }, [values.address.postal_code])

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

  const handleLocationSelected = (selection) => {
    if (selection === null) {
      initializeAddress()
    } else {
      const address = Object.assign(
        {},
        ...selection.address_components.map((x) => ({
          [x.types[0]]: x.long_name
        }))
      )
      setFieldValue('address', {
        street: address?.route,
        number: address?.street_number || '',
        lat: selection?.geometry?.location?.lat(),
        long: selection?.geometry?.location?.lng(),
        postal_code: address?.postal_code
      })
    }
  }
  return (
    <>
      <TextRecomendation
        title={t('GURB_ADDRESS_TITLE')}
        text={t('GURB_ADDRESS_TITLE_HELPER')}
      />
      <LocationInput
        textFieldLabel={t('GURB_ADDRESS_LABEL')}
        textFieldName={t('GURB_ADDRESS_FIELD')}
        textFieldHelper={t('GURB_ADDRESS_HELPER')}
        id="address-street"
        name="address.street"
        value={addressValue}
        onChange={handleAddressChange}
        onLocationSelected={handleLocationSelected}
      />
    </>
  )
}
export default Address
