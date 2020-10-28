import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

import MailOutlinedIcon from '@material-ui/icons/MailOutlined'

const useStyles = makeStyles((theme) => ({
  title: {
    '& h2': {
      fontWeight: '600',
      display: 'flex',
      alignContent: 'space-between',
      alignItems: 'center'
    }
  },
  actions: {
    margin: '16px'
  }
}))

const ContactDialog = (props) => {
  const classes = useStyles()
  const { open, handleClose, handleSend, isSending } = props

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-contact">
      <DialogTitle className={classes.title}>
        <MailOutlinedIcon fontSize="normal" />
        <span>&nbsp;Contacte amb la instal·ladora</span>
      </DialogTitle>
      <DialogContent>
        <TextField
          id="subject"
          margin="normal"
          label="Assumpte"
          type="text"
          variant="outlined"
          fullWidth
          value={subject}
          onChange={ (event) => setSubject(event.target.value) }
        />
        <TextField
          margin="normal"
          id="message"
          label="Escriu el teu missatge..."
          type="text"
          multiline
          rows={8}
          fullWidth
          variant="outlined"
          value={message}
          onChange={ (event) => setMessage(event.target.value) }
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleClose} variant="contained">
          Tancar
        </Button>
        <Button
          onClick={() => handleSend({ subject, message })}
          variant="contained"
          color="primary"
          disabled={isSending}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ContactDialog
