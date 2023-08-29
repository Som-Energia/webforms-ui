import React from 'react'
import { Button } from '@material-ui/core'

function SubmitButton(props) {
    const {startIcon, disabled, onClick, title} = props
  return (
    <Button
      type="button"
      data-cy="submit"
      variant="contained"
      color="primary"
      startIcon={startIcon}
      disabled={disabled}
      onClick={onClick}>
      {title}
    </Button>
  )
}

export default SubmitButton
