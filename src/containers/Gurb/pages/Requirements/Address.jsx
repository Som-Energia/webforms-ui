import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import InputField from '../../components/InputField'

const Address = (props) => {
    const { t } = useTranslation()
    const { values, errors, touched, setFieldValue, setFieldTouched } = props
  
    const handleInputAddress = (event) => {
      setFieldValue('address.street', event.target.value)
    }
  
    const handleInputAddressBlur = () => {
      setFieldTouched('address.street', true)
    }
  
    return (
      <>
        <TextRecomendation
          title={t('GURB_ADDRESS_TITLE')}
          text={t('GURB_ADDRESS_TITLE_HELPER')}
        />
        &nbsp;
        <InputField
          textFieldLabel={t('GURB_ADDRESS_LABEL')}
          textFieldName={t('GURB_ADDRESS_FIELD')}
          textFieldHelper={t('GURB_ADDRESS_HELPER')}
          iconHelper={false}
          handleChange={handleInputAddress}
          handleBlur={handleInputAddressBlur}
          touched={touched?.address?.street}
          value={values.address.street}
          error={errors?.address?.street}
        />
      </>
    )
  }
  export default Address