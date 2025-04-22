import React from 'react'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

function PrevButton(props) {
  const { title, onClick, disabled, sx={} } = props
  return (
    <Button
      sx={{
        backgroundColor: '#F0F3EC',
        color: '#0B2E34',
        '&:hover': {
          color: '#0B2E34',
          backgroundColor: '#F0F3EC',         
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
