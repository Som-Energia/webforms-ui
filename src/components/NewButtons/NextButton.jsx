import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { buttonGurbDark } from '../../containers/Gurb/gurbTheme'

function NextButton(props) {
  const { onClick, disabled } = props
  const { t } = useTranslation()

  return (
    <Button
      sx={{ ...buttonGurbDark }}
      type="button"
      data-cy="next"
      variant="contained"
      endIcon={<ArrowForward />}
      disabled={disabled}
      onClick={onClick}>
      {t('GURB_NEXT')}
    </Button>
  )
}

export default NextButton
