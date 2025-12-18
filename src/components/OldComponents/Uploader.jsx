import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'

import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'

import PublishIcon from '@mui/icons-material/Publish'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DeleteIcon from '@mui/icons-material/Delete'

import { uploadFile } from '../../services/api'

const Uploader = (props) => {

  const { name='uploads', callbackFn, fieldError, values=[], maxFiles = 1 } = props
  const { t } = useTranslation()

  const [uploads, setUploads] = useState([...values])
  const [inputKey, setInputKey] = useState(Date.now())
  const [isUploading, setUploading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    callbackFn(uploads)
  }, [uploads])

  const upload = useCallback(
    async (name, file) => {
      return uploadFile(name, file)
        .then((response) => {
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
        .catch((error) => {
          const errorMsg = error?.response?.data?.code
            ? error.response.data.code
            : 'MODIFY_POTTAR_UNEXPECTED'
          setError(errorMsg)
        })
    },
    [uploads]
  )

  const handleChange = useCallback(
    async (event) => {
      setUploading(true)
      const name = event.target.name
      const file = event.target.files[0]
      await upload(name, file)
      setUploading(false)
    },
    [upload]
  )

  const handleClean = (event) => {
    event.preventDefault()
    setError(false)
    setInputKey(Date.now())
  }

  const handleDelete = useCallback(
    (event, index) => {
      const uploadsToDelete = uploads
      uploadsToDelete.splice(index, 1)
      setUploads([...uploadsToDelete])
    },
    [uploads]
  )

  return (
    <>
      <TextField
        key={inputKey}
        type="file"
        label=""
        sx={{
          '& input': {
            color: 'rgba(0, 0, 0, 0.54)'
          },
          '& path': {
            color: 'rgba(0, 0, 0, 0.54)'
          }
        }}
        required
        name={name}
        variant="outlined"
        onChange={handleChange}
        disabled={maxFiles <= uploads.length}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isUploading ? (
                <CircularProgress size={24} />
              ) : error ? (
                <IconButton onClick={handleClean}>
                  <HighlightOffIcon />
                </IconButton>
              ) : (
                <PublishIcon />
              )}
            </InputAdornment>
          )
        }}
        error={(error || fieldError) && true}
        helperText={
          error
            ? t(error)
            : fieldError
            ? t(fieldError)
            : t('INSTALL_TYPE_ATTACHMENTS_INFO')
        }
      />
      <List>
        {uploads.map((upload, index) => (
          <ListItem key={upload}>
            <ListItemIcon>
              <AttachFileIcon />
            </ListItemIcon>
            <ListItemText>{upload}</ListItemText>
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(event) => handleDelete(event, index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  )
}

Uploader.propTypes = {
  name: PropTypes.string,
  values: PropTypes.array,
  maxFiles: PropTypes.number
}


export default React.memo(Uploader)
