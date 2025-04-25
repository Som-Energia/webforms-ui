import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import useTheme from '@mui/material/styles/useTheme'

function SubmitButton(props) {
  const {startIcon, disabled, title, loading} = props
  const theme = useTheme()
  
  return (
    <Button
      type="submit"
      data-cy="submit"
      variant="contained"
      color="primary"
      sx={{
        backgroundColor: theme.palette.secondary.alt,
        color: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.secondary.alt,
          backgroundColor: theme.palette.primary.main,
        }
      }}
      startIcon={loading ? (
          <CircularProgress size={24} />
        ) : (
          startIcon
        )}
      disabled={disabled}>
      {title}
    </Button>
  )
}

export default SubmitButton
