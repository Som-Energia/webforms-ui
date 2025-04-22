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
      sx={{
        backgroundColor: '#CDFF80',
        color: '#0B2E34',
        '&:hover': {
          color: '#CDFF80',
          backgroundColor: '#0B2E34',         
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
