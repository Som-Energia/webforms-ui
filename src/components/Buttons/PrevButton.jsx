import React from 'react'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

function PrevButton(props) {
  const { title, onClick, disabled, sx={} } = props
  return (
    <Button
      sx={{color:"secondary.dark",...sx}}
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
