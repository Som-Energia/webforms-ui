import React from 'react'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import useTheme from '@mui/material/styles/useTheme'

function PrevButton(props) {
  const { title, onClick, disabled, sx={} } = props
  const theme = useTheme()

  return (
    <Button
      sx={{
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.secondary.light,         
        }
      }}
      data-cy="prev"
      startIcon={<ArrowBackIosIcon/>}
      disabled={disabled}
      onClick={onClick}
      >
      {title}
    </Button>
  )
}

export default PrevButton
