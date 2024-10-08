import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import { buttonGurbDark, textBody1 } from '../gurbTheme'
import Typography from '@mui/material/Typography'

function NextButton(props) {
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
      {/* <Typography */}
        {/* sx={{ ...textBody1, textTransform: 'capitalize', color: '#FFFFFF' }}> */}
        {t('GURB_NEXT')}
      {/* </Typography> */}
    </Button>
  )
}

export default NextButton
