import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const TermsDialog = (props) => {
  const { t } = useTranslation()
  const { open, onClose, onAccept, title, content } = props
  const descriptionElementRef = useRef(null)

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            dangerouslySetInnerHTML={{ __html: content }}
          >
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-cy="decline" onClick={onClose}>
            {t('I_DECLINE')}
          </Button>
          <Button data-cy="accept" onClick={onAccept} variant="contained" color="primary">
            {t('I_ACCEPT')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TermsDialog
