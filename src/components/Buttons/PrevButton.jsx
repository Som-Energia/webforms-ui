import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'

import { buttonLight } from './buttonStyles'

function PrevButton(props) {
  const { onClick, disabled, title = 'PREV' } = props
  const { t } = useTranslation()

  return (
    <Button
      tabIndex={0}
      sx={{
        ...buttonLight,
        height: '40px',
        padding: '13px 18px',
        boxSizing: 'border-box'
      }}
      data-cy="prev"
      startIcon={
        <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center' }}>
          <ArrowBack style={{ width: '100%', height: '100%' }} />
        </Box>
      }
      disabled={disabled}
      onClick={onClick}>
      {t(title)}
    </Button>
  )
}

export default PrevButton
