import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import { buttonGurbDark } from '../../containers/Gurb/gurbTheme'

function SubmitButton(props) {
  const { onClick, disabled } = props

  const { t } = useTranslation()

  return (
    <Button
      sx={{ ...buttonGurbDark }}
      type="button"
      data-cy="next"
      variant="contained"
      disabled={disabled}
      onClick={onClick}>
      {t('GURB_PAYMENT_SUBMIT')}
    </Button>
  )
}

export default SubmitButton
