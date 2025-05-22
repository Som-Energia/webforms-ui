import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

const TermsDialog = (props) => {
  const { t } = useTranslation()
  const { open, onClose, onAccept, title, maxWidth = 'md', acceptText = 'I_ACCEPT' } = props

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
            {props.children}
        </DialogContent>
        <DialogActions>
          { onClose ?
            <Button data-cy="decline" sx={{color:'secondary.dark'}} onClick={onClose} id="terms-dialog-decline-btn">
              {t('I_DECLINE')}
            </Button>
            : null
          }
          <Button data-cy="accept" onClick={onAccept} variant="contained" color="primary" id="terms-dialog-accept-btn">
            {t(acceptText)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TermsDialog
