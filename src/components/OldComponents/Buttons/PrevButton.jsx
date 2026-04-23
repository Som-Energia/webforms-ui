import React from "react"

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import Button from "@mui/material/Button"

function PrevButton(props) {
  const { title, onClick, disabled, sx = {} } = props

  return (
    <Button
      sx={{
        ...sx,
        ...{
          backgroundColor: "secondary.light",
          color: "primary.main",
          "&:hover": {
            color: "primary.main",
            backgroundColor: "secondary.light",
          },
        },
      }}
      data-cy="prev"
      startIcon={<ArrowBackIosIcon />}
      disabled={disabled}
      onClick={onClick}>
      {title}
    </Button>
  )
}

export default PrevButton
