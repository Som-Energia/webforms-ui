import React from 'react';
import Dialog from '@mui/material/Dialog';
import PopUpContext from '../context/PopUpContext';


const customStyles = (withBackground, additionalStyles = {}) => ({
  sx: {
  position: 'absolute',
  top: 0,
  backgroundColor: withBackground ? 'white' : 'transparent',
  ...additionalStyles,
}})

function CustomDialog({ children, withBackground, blockHandleClose, paperStyles }) {

  const { setContent } = React.useContext(PopUpContext)

  const handleClose = () => {
    if (!blockHandleClose) {
      setContent(undefined);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={children === undefined ? false : true}
      PaperProps={customStyles(withBackground, paperStyles)}
      slotProps={{
        backdrop: {
          sx: {backgroundColor: 'primary.light'}
        }
      }}
      id='custom-dialog'
    >
      {children}
    </Dialog>
  );
}

export default CustomDialog
