import React from 'react'
import { Button } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

function NextButton(props) {
  const { title, onClick, disabled } = props
  return (
    <Button
      type="button"
      data-cy="next"
      variant="contained"
      color="primary"
      endIcon={<ArrowForwardIosIcon />}
      disabled={disabled}
      onClick={onClick}>
      {title}
    </Button>
  )
}

export default NextButton
