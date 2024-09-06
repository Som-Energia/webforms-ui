// import Box from "@mui/material/Box"
import { useTranslation } from 'react-i18next'
import InputField from './InputField'

const CUPS = () => {
  const { t } = useTranslation()

  return (
    <InputField
      TextFieldName={'CUPS'}
      TextFieldHelper={t('On puc trobar el CUPS?')}
    />
  )
}
export default CUPS
