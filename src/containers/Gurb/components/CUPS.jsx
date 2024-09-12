import { useTranslation } from 'react-i18next'
import InputField from './InputField'

const CUPS = () => {
  const { t } = useTranslation()

  return (
    <InputField
      textFieldName={'CUPS'}
      textFieldHelper={t('On puc trobar el CUPS?')}
      iconHelper={true}
    />
  )
}

export default CUPS
