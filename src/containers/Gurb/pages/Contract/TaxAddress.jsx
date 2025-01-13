import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import InputField from '../../components/InputField'
import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../components/Chooser'
import SomStepper from '../../components/SomStepper'
import LocationInput from '../../components/AddressAutocompletedField'

import ArticleIcon from '@mui/icons-material/Article'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import GurbLoadingContext from '../../../../context/GurbLoadingContext'
import { setMunicipisWithPostalCode } from '../../../../services/utils'

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
    setFieldTouched
  } = props

  const { t } = useTranslation()
  const { loading, setLoading } = useContext(GurbLoadingContext)
  const [addressValue, setAddressValue] = useState('')

  const handleHolderAddressQuestion = (value) => {
    setFieldValue('tax_address.has_different_address', value)
  }

  const handleAddressChange = (value) => {
    setAddressValue(value)
  }

  const initializeAddress = () => {
    setFieldValue('tax_address', {
      has_different_address: values.tax_address.has_different_address,
      street: '',
      number: '',
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
      setFieldValue('tax_address', {
        has_different_address: values.tax_address.has_different_address,
        street: address?.route,
        number: address?.street_number || '',
        postal_code: address?.postal_code
      })
    }
  }

  useEffect(() => {
    const postalCode = values.tax_address.postal_code
    if (postalCode?.length > 4) {
      setMunicipisWithPostalCode(
        postalCode,
        'tax_address.state',
        'tax_address.city',
        setFieldValue
      )
    }
  }, [values.tax_address.postal_code])

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
        textFieldName={t('GURB_ADDRESS_FIELD')}
        textFieldNameHelper={t('GURB_HOLDER_ADDRESS_FIELD_HELPER')}
        value={supplypointAddress}
        readonlyField={true}
      />
      <Box marginTop={'3rem'} marginBottom={'4rem'}>
        <Typography sx={textHeader4}>
          {t('GURB_HOLDER_ADDRESS_QUESTION')}
        </Typography>
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
        <LocationInput
          textFieldLabel={t('GURB_ADDRESS_LABEL')}
          textFieldName={t('GURB_TAX_ADDRESS_FIELD')}
          textFieldHelper={t('GURB_ADDRESS_HELPER')}
          id="tax_address-street"
          name="tax_address.street"
          value={addressValue}
          onChange={handleAddressChange}
          onLocationSelected={handleLocationSelected}
        />
      ) : (
        <></>
      )}
    </>
  )
}
export default TaxAddress
