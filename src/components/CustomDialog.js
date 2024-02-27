import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import PopUpContext from '../context/PopUpContext';
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles({
  customBackdrop: {
    backgroundColor: 'rgba(150, 182, 51, 0.5)', // Set your desired backdrop color here
  },
  modal:{
    position:'absolute',
    top:0
  }
})



function CustomDialog({children}){

  const classes = useStyles()
  const { setContent } = React.useContext(PopUpContext)

  const handleClose = () => {
    setContent(undefined);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={children}
      PaperProps={{ className: classes.modal }}
      BackdropProps={{ className: classes.customBackdrop }}
    >
    {children}
    </Dialog>
  );
}

export default CustomDialog
