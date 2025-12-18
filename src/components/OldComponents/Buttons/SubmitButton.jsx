import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

function SubmitButton(props) {
  const {startIcon, disabled, title, loading} = props
  
  return (
    <Button
      type="submit"
      data-cy="submit"
      variant="contained"
      color="primary"
      sx={{
        backgroundColor: 'primary.extraLight',
        color: 'primary.main',
        '&:hover': {
          color: 'primary.extraLight',
          backgroundColor: 'primary.main'
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
