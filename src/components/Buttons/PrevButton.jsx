import React from 'react'
import { Button } from '@mui/material'
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
      sx={{color:'secondary.dark'}}
      >
      {title}
    </Button>
  )
}

export default PrevButton
