import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { buttonGurbDark } from '../../containers/Gurb/gurbTheme'

function NextButton(props) {
  const { onClick, disabled, title = "GURB_NEXT" } = props
  const { t } = useTranslation()

  return (
    <Button
      sx={{
        ...buttonGurbDark,
        height: '40px',
        padding: '13px 18px',
        boxSizing: 'border-box'
      }}
      type="button"
      data-cy="next"
      variant="contained"
      endIcon={<ArrowForward sx={{ fontSize: 20 }} />}
      disabled={disabled}
      onClick={onClick}>
      {t(title)}
    </Button>
  )
}

export default NextButton
