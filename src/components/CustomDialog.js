import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import PopUpContext from '../context/PopUpContext';
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles({
  customBackdrop: {
    backgroundColor: 'rgba(150, 182, 51, 0.5)', // Set your desired backdrop color here
  },
  modal: (withBackground) => ({
    position: 'absolute',
    top: 0,
    backgroundColor: withBackground ? 'white' : 'transparent',
    boxShadow: withBackground ? '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)' : 'none'
  })
})



function CustomDialog({ children, withBackground, blockHandleClose }) {

  const classes = useStyles(withBackground)
  const { setContent } = React.useContext(PopUpContext)

  const handleClose = () => {
    if(!blockHandleClose){
      setContent(undefined);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={children === undefined ? false : true}
      PaperProps={{ className: classes.modal }}
      BackdropProps={{ className: classes.customBackdrop }}
      id='custom-dialog'
    >
      {children}
    </Dialog>
  );
}

export default CustomDialog
