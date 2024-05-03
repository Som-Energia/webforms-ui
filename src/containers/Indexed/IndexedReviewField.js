import clsx from 'clsx'
import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const ReviewField = ({ label, value }) => {
  
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 0.8,
      '& .field__value': {
        flexGrow: 1
      }
    }} >
      {label !== false && (
        <div className="field__title">
          <Typography sx={{
            textTransform: 'uppercase',
            paddingRight: '12px',
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(0, 0, 0, 0.54)'
          }} variant="subtitle2">
            <>{label}</>
          </Typography>
        </div>
      )}
      <div className={clsx('field__value')}>
        <Typography
          id={label + '__value'}
          sx={{ fontSize: '13px' }}
          variant="body2">
          <>{value}</>
        </Typography>
      </div>
    </Box>
  )
}

export default ReviewField
