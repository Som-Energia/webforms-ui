import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { textReviewLabel, textReviewValue } from '../../gurbTheme'


const ReviewField = ({ label, value }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
      {label !== false && (
        <Box className="field__title">
          <Typography
            sx={{
              paddingRight: '0.5rem',
              paddingBlock: '0.2rem',
              ...textReviewLabel
            }}
            noWrap>
            {label}
          </Typography>
        </Box>
      )}
      <Box>
        <Typography sx={{ ...textReviewValue }} variant="body2">
          {value}
        </Typography>
      </Box>
    </Box>
  )
}

export default ReviewField