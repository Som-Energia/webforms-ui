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
      disableElevation={true}
      sx={{
        backgroundColor: "secondary.alt",
        color: "primary.main",
        '&:hover': {
          color: "secondary.alt",
          backgroundColor: "primary.main",
        }
      }}
      endIcon={<ArrowForwardIosIcon />}
      {...props}
    >
      {title}
    </Button>
  )
}

export default NextButton
