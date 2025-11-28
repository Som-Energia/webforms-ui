import { useRef, useState, createRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

import RequiredTitle from './InputTitle'
import { uploadFile } from '../services/api'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

const DragDrop = ({ fieldName, required, values, onChange }) => {
  const { t } = useTranslation()

  const [drag, setDrag] = useState(false)
  const [error, setError] = useState(false)
  const [uploads, setUploads] = useState([...values])

  let dropRef = createRef()

  const fileInputRef = useRef(null)
  const getErrorMessage = (code) => {
    switch (code) {
      case 'INVALID_FILETYPE':
        return t('INVALID_FILETYPE')
    }
  }

  useEffect(() => {
    onChange(uploads)
  }, [uploads])

  const upload = (name, file) => {
    return uploadFile(name, file)
      .then((response) => {
        if (response?.data?.code === 'UPLOAD_OK') {
          const fileHash = response?.data?.file_hash
          setUploads([...uploads, {"filename":name, "filehash": fileHash}])
        } else {
          const errorMsg = getErrorMessage(response?.data?.code)
          setError(errorMsg)
        }
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error?.response?.data?.code)
        setError(errorMsg)
      }), [uploads]
  }
  const prevent = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrag = (e) => {
    prevent(e)
  }

  const handleDragIn = (e) => {
    prevent(e)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setDrag(true)
  }

  const handleDragOut = (e) => {
    prevent(e)
    setDrag(false)
  }

  const handleDrop = (e) => {
    setError(false)
    prevent(e)
    setDrag(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (!validateFileType(file)) {
        setError(t('INVALID_FILETYPE'))
        return
      }
      onDrop(file)
      upload(file.name, file)
      e.dataTransfer.clearData()
    }
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  const validateFileType = (file) => {
    return allowedTypes.includes(file.type)
  }
  useEffect(() => {
    let div = dropRef.current
    div.addEventListener('dragenter', handleDragIn)
    div.addEventListener('dragleave', handleDragOut)
    div.addEventListener('dragover', handleDrag)
    div.addEventListener('drop', handleDrop)
    return () => {
      div.removeEventListener('dragenter', handleDragIn)
      div.removeEventListener('dragleave', handleDragOut)
      div.removeEventListener('dragover', handleDrag)
      div.removeEventListener('drop', handleDrop)
    }
  })

  const handleLinkClick = (e) => {
    e.preventDefault()
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!validateFileType(file)) {
        setError(t('INVALID_FILETYPE'))
        return
      }
      setError(false)
      onDrop(file)
      upload(file.name, file)
    }
  }

  const handleDelete = (index) => {
    const uploadsToDelete = uploads
    uploadsToDelete.splice(index, 1)
    setUploads([...uploadsToDelete])
  }

  const onDrop = () => {}

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <RequiredTitle
          text={fieldName}
          required={required}
        />
      </Grid>
      <Grid item xs={12}>
        <Card
          ref={dropRef}
          sx={{
            padding: '2rem',
            borderRadius: '8px',
            border: drag
              ? '2px dashed black'
              : uploads
                ? '2px dashed #96B633'
                : '2px dashed #D9D9D9',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            gap: 1
          }}>
          {error ? (
            <Alert sx={{ borderRadius: '8px' }} severity="error">
              {error}
            </Alert>
          ) : uploads && !drag ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <List>
              {uploads.map((upload, index) => (
                <ListItem>
                  <Typography variant='body.md.regular' sx={{ marginRight: '1rem' }}>
                    {upload.filename}
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(index)}>
                    <DeleteOutlineOutlinedIcon sx={{ color: 'gray' }} />
                  </IconButton>
                </ListItem>
              ))}
              </List>
            </Box>
          ) : (
            <UploadFileIcon sx={{ marginBottom: '12px' }} color="primary" />
          )}
          <Typography variant='body.md.regular' sx={{ display: 'flex', alignItems: 'center', padding: 0, margin: 0, gap: 1 }}>
            <Link component="button" overlay onClick={handleLinkClick}>
              {t('GURB_CLICK_HERE')}
            </Link>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />{' '}
            {t('GURB_DRAG_AND_DROP_HERE')}
          </Typography>
          <Typography variant='body.xs.regular'>{t('GURB_TYPE_OF_FILES')}</Typography>
        </Card>
      </Grid>
    </Grid>
  )
}
export default DragDrop
