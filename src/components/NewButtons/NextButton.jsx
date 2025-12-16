import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { buttonGurbDark } from '../../themes/gurbTheme'

function NextButton(props) {
  const { onClick, disabled, title = "NEXT" } = props
  const { t } = useTranslation()

  return (
    <Button
      tabIndex={0}
      sx={{
        ...buttonGurbDark,
        height: '40px',
        padding: '13px 18px',
        boxSizing: 'border-box',
        lineHeight: 1,
        textTransform: 'none'
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
