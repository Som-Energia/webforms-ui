import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'


const IncidenceDialog = (props) => {
  const { t } = useTranslation()

  const { open, handleClose, handleSend, isSending } = props

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-contact">
      <DialogTitle sx={{
        '& h2': {
          fontWeight: '600',
          display: 'flex',
          alignContent: 'space-between',
          alignItems: 'center'
        }
      }}>
        <ReportProblemOutlinedIcon fontSize="normal" />
        <span>&nbsp; {t('NOTIFY_INCIDENCE')} </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('NOTIFY_INCIDENCE_SOM')}
        </DialogContentText>
        <TextField
          autoFocus
          margin="normal"
          id="subject"
          label={t('SUBJECT')}
          type="text"
          variant="outlined"
          fullWidth
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />
        <TextField
          margin="normal"
          id="body"
          label={t('WRITE_MESSAGE')}
          type="text"
          multiline
          rows={6}
          variant="outlined"
          fullWidth
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ margin: '16px' }} >
        <Button onClick={handleClose} variant="contained">
          {t('CLOSE')}
        </Button>
        <Button
          onClick={() => handleSend({ subject, message })}
          variant="contained"
          color="primary"
          disabled={isSending}
        >
          {t('SEND')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default IncidenceDialog
