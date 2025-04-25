import React from 'react'
import Button from '@mui/material/Button'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import useTheme from '@mui/material/styles/useTheme'

function NextButton({title, ...props}) {

  const theme = useTheme()
  return (
    <Button
      type="button"
      data-cy="next"
      variant="contained"
      color="primary"
      disableElevation={true}
      sx={{
        backgroundColor: theme.palette.secondary.alt,
        color: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.secondary.alt,
          backgroundColor: theme.palette.primary.main,         
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
