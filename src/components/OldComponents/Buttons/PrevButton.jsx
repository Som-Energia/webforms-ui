import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

function PrevButton(props) {
  const { title, onClick, disabled } = props

  return (
    <Button
      sx={{
        backgroundColor: "secondary.light",
        color: "primary.main",
        '&:hover': {
          color: "primary.main",
          backgroundColor: "secondary.light",
        }
      }}
      data-cy="prev"
      startIcon={<ArrowBackIosIcon />}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </Button>
  )
}

export default PrevButton
