import React from 'react'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import WarningRounded from '@mui/icons-material/WarningRounded'
import Stack from '@mui/material/Stack'
import CancelIcon from '@mui/icons-material/Cancel'

import CustomDialog from './CustomDialog'

import useCheckMobileScreen from '../services/checkMobileScreen'
import {
  dialogCancelIcon,
  dialogWarningRounded,
  dialogTitle,
  dialogIconButton,
  dialogContentStack
} from '../themes/gurbTheme'

export default function SimpleDialog({
  title,
  text1,
  text2,
  closeFunction,
  severity
}) {
  const isMobile = useCheckMobileScreen()

  return (
    <CustomDialog
      data-testid="simple-dialog"
      withBackground={true}
      paperStyles={{
        width: '448px',
        maxWidth: '90vw',
        height: isMobile && severity === 'error' ? '360px' : '300px',
        maxHeight: '80vh',
        margin: '20px'
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        {severity === 'warning' && <WarningRounded sx={dialogWarningRounded} />}
        {severity === 'error' && <CancelIcon sx={dialogCancelIcon} />}
      </Box>

      {title && (
        <DialogTitle id="simple-dialog-title" sx={dialogTitle}>
          <Box>{title}</Box>
        </DialogTitle>
      )}

      <IconButton
        aria-label="close"
        onClick={closeFunction}
        sx={dialogIconButton}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack sx={dialogContentStack}>
          <Box>{text1}</Box>
          <Box>{text2}</Box>
        </Stack>
      </DialogContent>
    </CustomDialog>
  )
}
