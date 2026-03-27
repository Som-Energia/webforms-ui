import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import ApiValidatedField from './ApiValidatedField'
import { checkIbanFormat } from '../../services/utils'

export function IBANField(props) {
  const { onChange, ...others } = props
  function inputFilter(value) {
    if (!value) return value
    value = value.replace(/[^0-9A-Za-z]/g, '') // TODO: Do not cut chars after not matching one
    value = value.slice(0, 24)
    value = value.toUpperCase()
    value = value.split(' ').join('')
    value = value.match(/.{1,4}/g).join(' ')
    return value
  }
  function localCheck(value) {
    const valid = checkIbanFormat(value)
    return { value, valid }
  }
  return (
    <ApiValidatedField
      {...others}
      leadingIcon={AccountBalanceOutlinedIcon}
      inputFilter={inputFilter}
      localCheck={localCheck}
      onChange={(newValue) => {
        return onChange({
          ...newValue,
          // TODO: deprecated API, remove when unused
          IBAN: newValue.value,
          IBANValid: newValue.valid,
        })
      }}
    />
  )
}

export default IBANField
