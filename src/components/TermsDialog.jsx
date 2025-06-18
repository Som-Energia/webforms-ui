import React, { useState, useRef, useEffect } from 'react'
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

  const checkScroll = () => {
    const el = contentRef.current
    if (!el) return

    if (el.scrollHeight <= el.clientHeight) {
      setScrolledToBottom(true)
    } else {
      setScrolledToBottom(false)
    }
  }

  useEffect(() => {
    if (!open) return

    setScrolledToBottom(false)

    const timeoutId = setTimeout(() => {
      checkScroll()
    }, 100)

    // Observer to changes in content size
    let resizeObserver
    if (contentRef.current) {
      resizeObserver = new ResizeObserver(() => {
        checkScroll()
      })
      resizeObserver.observe(contentRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      if (resizeObserver && contentRef.current) {
        resizeObserver.unobserve(contentRef.current)
        resizeObserver.disconnect()
      }
    }
  }, [open])

  const handleScroll = () => {
    const el = contentRef.current
    if (!el) return

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
        data-cy="generic_conditions_modal"
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
