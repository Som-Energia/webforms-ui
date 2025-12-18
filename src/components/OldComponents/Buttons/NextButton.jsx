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
        backgroundColor: 'primary.extraLight',
        color: 'primary.main',
        '&:hover': {
          color: 'primary.extraLight',
          backgroundColor: 'primary.main'
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
