import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { buttonGurbDark } from '../../containers/Gurb/gurbTheme'

function SubmitButton(props) {
  const { onClick, disabled, sending, text='GURB_PAYMENT_SUBMIT' } = props

  const { t } = useTranslation()

  return (
    <Button
      tabIndex={0}
      sx={{ ...buttonGurbDark }}
      type="button"
      data-cy="next"
      variant="contained"
      disabled={disabled}
      onClick={onClick}
    >
      {sending ? (
        <CircularProgress size={24} sx={{ color: 'white' }} />
      ) : (
        t(text)
      )}
    </Button>
  )
}

export default SubmitButton
