import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const TermsDialog = (props) => {
  const { t } = useTranslation()
  const { open, onClose, onAccept, title, maxWidth = 'md' } = props

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth={maxWidth}
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            tabIndex={-1}
          >
            {props.children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-cy="decline" id={'decline-button'} onClick={onClose}>
            {t('I_DECLINE')}
          </Button>
          <Button data-cy="accept" id={'accept-button'} onClick={onAccept} variant="contained" color="primary">
            {t('I_ACCEPT')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TermsDialog
