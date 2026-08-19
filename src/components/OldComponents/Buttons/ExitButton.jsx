import React from "react"

import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import Button from "@mui/material/Button"

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
