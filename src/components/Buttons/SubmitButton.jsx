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
        backgroundColor: '#CDFF80',
        color: '#0B2E34',
        '&:hover': {
          color: '#CDFF80',
          backgroundColor: '#0B2E34',
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
