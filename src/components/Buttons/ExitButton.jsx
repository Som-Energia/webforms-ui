import React from 'react'
import Button from '@mui/material/Button'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

function ExitButton(props) {
  const { title, onClick } = props
  return (
    <Button
      type="button"
      data-cy="exit"
      variant="contained"
      color="primary"
      endIcon={<ExitToAppIcon />}
      onClick={onClick}>
      {title}
    </Button>
  )
}

export default ExitButton