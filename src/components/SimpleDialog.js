import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CustomDialog from './CustomDialog';
import { useTranslation } from 'react-i18next';

export default function SimpleDialog({ title, text, acceptFunction, cancelFunction }) {
  const {t} = useTranslation()

  return (

    <CustomDialog data-testid="simple-dialog" withBackground={true}>
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <DialogContent>
          {text}
      </DialogContent>
      <DialogActions>
        {cancelFunction
          ? <Button data-testid="simple-dialog-button-cancel" onClick={() => cancelFunction()} color="primary">
            {t('GENERATION_ADD_CONTRACT_LIST_CANCEL')}
          </Button>
          : null}
        {acceptFunction
          ? <Button data-testid="simple-dialog-button-accept" onClick={() => acceptFunction()} color="primary" autoFocus>
            {t('GENERATION_ADD_CONTRACT_LIST_ACCEPT')}
          </Button>
          : null}
      </DialogActions>
    </CustomDialog>

  );
}
