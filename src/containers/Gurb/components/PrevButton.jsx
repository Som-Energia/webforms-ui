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
      startIcon={
        <ArrowBackIosIcon
        //   sx={{
        //     color: '#1E1E1E',
        //     width: '0.8rem'
        //   }}
        />
      }
      disabled={disabled}
      onClick={onClick}>
      {t('GURB_PREV')}
    </Button>
  )
}

export default PrevButton
