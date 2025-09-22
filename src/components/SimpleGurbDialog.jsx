import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

import CustomDialog from './CustomDialog';

export default function SimpleDialog({ title, text1, text2, closeFunction, severity }) {
  return (
    <CustomDialog data-testid="simple-dialog" withBackground={true}>

      <DialogTitle id="simple-dialog-title">
        <Box sx={{display:'flex', justifyContent:'center', color: 'orange', mt: 4}}>
          <WarningIcon />
        </Box>
        <Box>
          {title}
        </Box>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeFunction}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box>
          {text1}
        </Box>
        <Box>
          {text2}
        </Box>
      </DialogContent>
    </CustomDialog>
  );
}
