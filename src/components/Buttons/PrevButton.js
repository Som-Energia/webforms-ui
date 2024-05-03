import React from 'react'
import { Button } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

function PrevButton(props) {
  const { title, onClick, disabled } = props
  return (
    <Button
      data-cy="prev"
      startIcon={<ArrowBackIosIcon />}
      disabled={disabled}
      onClick={onClick}>
      {title}
    </Button>
  )
}

export default PrevButton
