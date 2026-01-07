import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import {
  buttonGurbDark,
  buttonGurbLight,
  textBody4,
  textHeader6
} from '../gurbTheme'

const TermsDialog = (props) => {
  const { t } = useTranslation()
  const { open, onClose, onAccept, title, maxWidth = 'md' } = props

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="paper"
        // aria-labelledby="scroll-dialog-title"
        // aria-describedby="scroll-dialog-description"
        maxWidth={maxWidth}>
        <DialogTitle sx={{ ...textHeader6 }}>{title}</DialogTitle>
        <DialogContent sx={{ ...textBody4 }}>{props.children}</DialogContent>
        <DialogActions>
          <Button sx={{ ...buttonGurbLight }} onClick={onClose}>
            {t('I_DECLINE')}
          </Button>
          <Button
            data-cy='accept'
            sx={{ ...buttonGurbDark }}
            onClick={onAccept}
            variant="contained">
            {t('I_ACCEPT')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TermsDialog
