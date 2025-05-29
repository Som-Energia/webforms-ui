import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import ArrowBack from '@mui/icons-material/ArrowBack'

import { buttonGurbLight, textBody1 } from '../../containers/Gurb/gurbTheme'

function PrevButton(props) {
  const { onClick, disabled } = props
  const { t } = useTranslation()

  return (
    <Button
      sx={{...buttonGurbLight}}
      data-cy="prev"
      startIcon={<ArrowBack />}
      disabled={disabled}
      onClick={onClick}>
      {t('GURB_PREV')}
    </Button>
  )
}

export default PrevButton
