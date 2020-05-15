import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'

import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'

import PublishIcon from '@material-ui/icons/Publish'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import FileIcon from '@material-ui/icons/Description'
import DeleteIcon from '@material-ui/icons/Delete'

import { uploadFile } from '../services/api'

const Uploader = (props) => {
  const { name, callbackFn, fieldError, values } = props
  const { t } = useTranslation()
  const [value, setValue] = useState()
  const [uploads, setUploads] = useState([...values])
  const [inputKey, setInputKey] = useState(Date.now())
  const [isUploading, setUploading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    callbackFn(uploads)
  }, [uploads, callbackFn])

  const handleChange = async (event) => {
    setUploading(true)
    const name = event.target.name
    const file = event.target.files[0]
    await upload(name, file)
    setUploading(false)
  }

  const upload = async (name, file) => {
    return uploadFile(name, file)
      .then(response => {
        if (response?.data?.code === 'UPLOAD_OK') {
          setUploads([...uploads, response?.data?.file_hash])
          setInputKey(Date.now())
        } else {
          const errorMsg = response?.data?.code
            ? response?.data?.code
            : 'MODIFY_POTTAR_UNEXPECTED'
          setError(errorMsg)
        }
      })
      .catch(error => {
        const errorMsg = error?.response?.data?.code
          ? error.response.data.code
          : 'MODIFY_POTTAR_UNEXPECTED'
        setError(errorMsg)
      })
  }

  const handleClean = event => {
    event.preventDefault()
    setError(false)
    setInputKey(Date.now())
  }

  const handleDelete = (event, index) => {
    event.preventDefault()
    const uploadsToDelete = uploads
    uploadsToDelete.splice(index, 1)
    setUploads([...uploadsToDelete])
  }

  return (
    <>
      <TextField
        key={inputKey}
        type="file"
        label=""
        required
        name={name}
        variant="outlined"
        onChange={handleChange}
        value={value}
        fullWidth
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              {
                isUploading
                  ? <CircularProgress size={24} />
                  : error ? <IconButton onClick={handleClean}><HighlightOffIcon /></IconButton>
                    : <IconButton><PublishIcon /></IconButton>
              }
            </InputAdornment>
        }}
        error={(error || fieldError) && true}
        helperText={error ? t(error) : (fieldError) ? t(fieldError) : t('INSTALL_TYPE_ATTACHMENTS_INFO')}
      />
      <List>
        {
          uploads.map((upload, index) => (
            <ListItem key={upload}>
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText>{upload}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={event => handleDelete(event, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
      </List>
    </>
  )
}

Uploader.propTypes = {
  name: PropTypes.string,
  values: PropTypes.array
}

Uploader.defaultProps = {
  name: 'uploads',
  values: []
}

export default Uploader
