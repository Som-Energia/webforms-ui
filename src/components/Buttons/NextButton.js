import React from 'react'
import { Button } from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

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
