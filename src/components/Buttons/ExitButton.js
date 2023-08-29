import React from 'react'
import { Button } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

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