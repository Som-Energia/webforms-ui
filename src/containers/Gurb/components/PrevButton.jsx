import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import { buttonGurbLight, textBody1 } from '../gurbTheme'

function PrevButton(props) {
  const { onClick, disabled } = props
  const { t } = useTranslation()

  return (
    <Button
      sx={{
        ...buttonGurbLight
      }}
      data-cy="prev"
      startIcon={<ArrowBackIosIcon />}
      disabled={disabled}
      onClick={onClick}>
      {t('GURB_PREV')}
    </Button>
  )
}

export default PrevButton
