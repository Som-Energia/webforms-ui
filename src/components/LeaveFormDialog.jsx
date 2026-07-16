import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { buttonDark, buttonLight } from './Buttons/buttonStyles'

const LeaveFormDialog = ({ open, onCancel, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{t('LEAVE_CONTRACT_FORM_TITLE')}</DialogTitle>
      <DialogContent>{t('LEAVE_CONTRACT_FORM_DESCRIPTION')}</DialogContent>
      <DialogActions>
        <Button sx={buttonLight} onClick={onCancel}>
          {t('LEAVE_CONTRACT_FORM_CANCEL')}
        </Button>
        <Button sx={buttonDark} onClick={onConfirm} variant="contained">
          {t('LEAVE_CONTRACT_FORM_CONFIRM')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeaveFormDialog
