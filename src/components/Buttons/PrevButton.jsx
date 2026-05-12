import Button from '@mui/material/Button'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'

import { buttonLight } from './buttonStyles'

function PrevButton(props) {
  const {
    onClick,
    disabled,
    startIcon = (
      <Box
        sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center' }}>
        <ArrowBack style={{ width: '100%', height: '100%' }} />
      </Box>
    ),
    children
  } = props

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
      startIcon={startIcon}
      disabled={disabled}
      onClick={onClick}>
      {children}
    </Button>
  )
}

export default PrevButton
