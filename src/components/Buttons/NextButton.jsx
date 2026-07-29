import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { buttonDark } from './buttonStyles'

function NextButton(props) {
  const {
    onClick,
    disabled,
    endIcon = <ArrowForward sx={{ fontSize: 20 }} />,
    children
  } = props

  return (
    <Button
      tabIndex={0}
      sx={{
        ...buttonDark,
        height: '40px',
        padding: '13px 18px',
        boxSizing: 'border-box',
        lineHeight: 1,
        textTransform: 'none'
      }}
      type="button"
      data-cy="next"
      variant="contained"
      endIcon={endIcon}
      disabled={disabled}
      onClick={onClick}>
      {children}
    </Button>
  )
}

export default NextButton
