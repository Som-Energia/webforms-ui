import React from 'react'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import WarningRounded from '@mui/icons-material/WarningRounded'
import Stack from '@mui/material/Stack'
import CancelIcon from '@mui/icons-material/Cancel';

import CustomDialog from './CustomDialog'

export default function SimpleDialog({ title, text1, text2, closeFunction, severity }) {
  return (
    <CustomDialog
      data-testid="simple-dialog"
      withBackground={true}
      paperStyles={{
        width: '448px',
        maxWidth: '90vw',
        height: '272px',
        maxHeight: '80vh',
        margin: '20px',
      }}
    >

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        {severity === 'warning' &&
          <WarningRounded
          sx={{
            fontSize: 44,
            color: 'warning.light'
          }}

          />
        }
        {severity === 'error' &&
          <CancelIcon
            sx={{
              fontSize: 40,
              color: 'error.light'
            }}
          />
        }
      </Box>

      {title && (
        <DialogTitle id="simple-dialog-title"
          sx={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            mb: -2,
          }}
        >
          <Box>
            {title}
          </Box>
        </DialogTitle>
      )}

      <IconButton
        aria-label="close"
        onClick={closeFunction}
        sx={(theme) => ({
          position: 'absolute',
          right: 18,
          top: 18,
          color: 'black'
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
        >
          <Box>
            {text1}
          </Box>
          <Box>
            {text2}
          </Box>
        </Stack>
      </DialogContent>
    </CustomDialog>
  )
}
