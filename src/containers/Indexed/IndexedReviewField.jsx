import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const ReviewField = ({ label, value }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 0.8,
        '& .field__value': {
          flexGrow: 1
        }
      }}>
      {label !== false && (
        <Box className="field__title">
          <Typography
            sx={{
              textTransform: 'uppercase',
              paddingRight: '12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1E1E1E'
            }}
            variant="subtitle2">
            <>{label}</>
          </Typography>
        </Box>
      )}
      <Box className="field__value">
        <Typography id={label + '__value'} sx={{ fontSize: '13px' }}>
          <>{value}</>
        </Typography>
      </Box>
    </Box>
  )
}

export default ReviewField
