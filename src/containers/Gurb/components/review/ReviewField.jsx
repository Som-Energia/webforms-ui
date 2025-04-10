import React, { useContext } from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import SummaryContext from '../../../../context/SummaryContext'

const ReviewField = ({ label, value, step }) => {
  const { setSummaryField } = useContext(SummaryContext)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {label !== false && (
        <Box className="field__title">
          <Typography
            sx={{
              paddingRight: '0.5rem',
              paddingBlock: '0.2rem',
            }}
            variant="body.sm.regular"
            color="secondary.dark"
            noWrap
          >
            {label}
          </Typography>
        </Box>
      )}
      <Box>
        <Typography
          variant="body.sm.regular"
          color="secondary.dark"
        >
          {step != undefined ? (
            <Link
              component="button"
              // variant="body2"
              onClick={() => {
                setSummaryField(step)
              }}
            >
              {value}
            </Link>
          ) : (
            value
          )}
        </Typography>
      </Box>
    </Box>
  )
}

export default ReviewField
