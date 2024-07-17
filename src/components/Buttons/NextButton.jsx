import React from 'react'
import Button from '@mui/material/Button'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

function NextButton({title, ...props}) {
  return (
    <Button
      type="button"
      data-cy="next"
      variant="contained"
      color="primary"
      endIcon={<ArrowForwardIosIcon />}
      {...props}
    >
      {title}
    </Button>
  )
}

export default NextButton
