import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../components/Chooser'
import SomStepper from '../../components/SomStepper'
import LocationInput from '../../components/AddressAutocompletedField'
import RequiredTitle from '../../components/InputTitle'

import ArticleIcon from '@mui/icons-material/Article'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { setMunicipisWithPostalCode } from '../../../../services/utils'
import { getPlaceDetails } from '../../../../services/googleApiClient'

import {
  iconOffRequirements,
  iconRequirements,
  textHeader4,
  textHeader5
} from '../../gurbTheme'


const TaxAddress = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched,
    setValues,
  } = props

  const { t } = useTranslation()
  const [addressValue, setAddressValue] = useState(values.tax_address.street)
  const sessionTokenRef = useRef()

  const handleHolderAddressQuestion = (value) => {
    setFieldValue('tax_address.has_different_address', value)
  }

  const updateAddressValues = async (value) => {
    getPlaceDetails(value.id, sessionTokenRef)
      .then((place) => {
        const postalCode = place.addressComponents.find(component =>
          component.types.includes('postal_code')
        );
        const street = place.addressComponents.find(component =>
          component.types.includes('route')
        );
        const updatedValues = {
          ...values,
          tax_address: {
            ...values.tax_address,
            postal_code: postalCode.longText,
            street: street.longText,
          }
        }
        setValues(updatedValues)
      }).catch((error) => {
        console.log(error)
      })
  }

  const handleAddressChange = (value) => {
    setAddressValue(value)
    if (value === null) {
      cleanAddressValues()
    }
    else {
      updateAddressValues(value)
    }
  }

  const cleanAddressValues = () => {
    setFieldValue('tax_address', {
      has_different_address: values.tax_address.has_different_address,
      street: '',
      number: '',
      postal_code: '',
      state: { id: '', name: '' },
      city: { id: '', name: '' }
    })
  }

  useEffect(() => {
    const postalCode = values.tax_address.postal_code
    if (postalCode?.length > 4) {
      setMunicipisWithPostalCode(
        postalCode,
        setFieldValue,
        'tax_address',
        values
      )
    }
  }, [values.tax_address.postal_code])

  const handleChangeInteger = (event) => {
    let cleanedValue = event.target.value.replace(/[^0-9]/g, '')
    setFieldValue(event.target.name, cleanedValue)
  }

  const handleChange = (event) => {
    setFieldValue(event.target.name, event.target.value)
  }

  const options = [
    {
      id: 'supplypoint-tax-address-same',
      icon: <ArticleIcon sx={iconRequirements} />,
      textHeader: t('GURB_SAME_SUPPLYPOINT_TAX_ADDRESS_HEADER'),
      textBody: t('GURB_SAME_SUPPLYPOINT_TAX_ADDRESS_BODY')
    },
    {
      id: 'supplypoint-tax-address-different',
      icon: <ArticleIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_DIFFERENT_SUPPLYPOINT_TAX_ADDRESS_HEADER'),
      textBody: t('GURB_DIFFERENT_SUPPLYPOINT_TAX_ADDRESS_BODY')
    }
  ]

  const supplypointAddress = `${values?.address.street}, ${values?.address.number} ${values?.address.postal_code}`
  return (
    <>
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation
          title={t('GURB_HOLDER_SUPPLYPOINT_TITLE')}
          text={t('GURB_HOLDER_ID_SUBTITLE')}
        />
        <SomStepper step={activeStep} connectors={7 + 1} />
      </Box>
      <InputField
        name='supplypointAddress'
        textFieldName={t('GURB_ADDRESS_FIELD')}
        textFieldNameHelper={t('GURB_HOLDER_ADDRESS_FIELD_HELPER')}
        value={supplypointAddress}
        readonlyField={true}
      />
      <Box marginTop={'3rem'} marginBottom={'4rem'}>
        <RequiredTitle
          text={t('GURB_HOLDER_ADDRESS_QUESTION')}
          textStyle={textHeader4}
          required={true}
        />
        <Typography sx={textHeader5}>
          {t('GURB_HOLDER_ADDRESS_QUESTION_HELPER')}
        </Typography>
        <Chooser
          options={options}
          value={values.tax_address.has_different_address}
          handleChange={handleHolderAddressQuestion}
        />
      </Box>
      {values.tax_address.has_different_address ===
        'supplypoint-tax-address-different' ? (
        <>
          {console.log(errors)}
          <LocationInput
            required
            textFieldLabel={t('GURB_ADDRESS_LABEL')}
            textFieldName={t('GURB_TAX_ADDRESS_FIELD')}
            textFieldHelper={t('GURB_ADDRESS_HELPER')}
            id="tax_address-street"
            name="tax_address.street"
            value={addressValue}
            onChange={handleAddressChange}
            sessionTokenRef={sessionTokenRef}
          />
          <Box sx={{ display: 'flex', gap: '2rem' }}>
            <Box>
              <InputField
                name={'tax_address.number'}
                textFieldName={t('NUMBER')}
                handleChange={handleChangeInteger}
                touched={touched?.tax_address?.number}
                value={values?.tax_address?.number}
                error={errors?.tax_address?.number}
                required={true}
              />
            </Box>
            <Box>
              <InputField
                name={'tax_address.floor'}
                textFieldName={t('FLOOR')}
                handleChange={handleChangeInteger}
                touched={touched?.tax_address?.floor}
                value={values?.tax_address?.floor}
                error={errors?.tax_address?.floor}
                required={false}
              />
            </Box>
            <Box>
              <InputField
                name={'tax_address.door'}
                textFieldName={t('DOOR')}
                handleChange={handleChangeInteger}
                touched={touched?.tax_address?.door}
                value={values?.tax_address?.door}
                error={errors?.tax_address?.door}
                required={false}
              />
            </Box>
            <Box>
              <InputField
                name={'tax_address.stairs'}
                textFieldName={t('STAIRS')}
                handleChange={handleChange}
                touched={touched?.tax_address?.stairs}
                value={values?.tax_address?.stairs}
                error={errors?.tax_address?.stairs}
                required={false}
              />
            </Box>
            <Box>
              <InputField
                name={'tax_address.bloc'}
                textFieldName={t('BLOCK')}
                handleChange={handleChange}
                touched={touched?.tax_address?.bloc}
                value={values?.tax_address?.bloc}
                error={errors?.tax_address?.bloc}
                required={false}
              />
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default TaxAddress
