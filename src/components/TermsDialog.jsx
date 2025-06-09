import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { buttonGurbDark, buttonGurbLight } from '../containers/Gurb/gurbTheme'

const TermsDialog = ({
  open,
  onClose,
  onAccept,
  title,
  acceptText = 'I_ACCEPT',
  children,
  maxWidth = 'sm'
}) => {
  const { t } = useTranslation()
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const contentRef = useRef(null)

  const handleScroll = () => {
    const el = contentRef.current
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      setScrolledToBottom(true)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth={maxWidth}
      fullWidth>
      <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
      <DialogContent
        dividers
        sx={{ fontFamily: 'Outfit' }}
        ref={contentRef}
        onScroll={handleScroll}
        style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {children}
      </DialogContent>
      <DialogActions>
        {onClose && (
          <Button
            sx={{
              ...buttonGurbLight,
              color: 'secondary',
              height: '40px',
              padding: '13px 18px',
              boxSizing: 'border-box'
            }}
            data-cy="decline"
            onClick={onClose}
            id="terms-dialog-decline-btn">
            {t('I_DECLINE')}
          </Button>
        )}
        <Button
          sx={{
            ...buttonGurbDark,
            height: '40px',
            padding: '13px 18px',
            boxSizing: 'border-box'
          }}
          data-cy="accept"
          onClick={onAccept}
          variant="contained"
          color="primary"
          disabled={!scrolledToBottom}
          id="terms-dialog-accept-btn">
          {t(acceptText)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TermsDialog
