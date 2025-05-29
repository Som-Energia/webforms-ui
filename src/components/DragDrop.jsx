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
import { textBody1, textBody3, textSubtitle2 } from '../containers/Gurb/gurbTheme'
import { uploadFile } from '../services/api'
import Grid from '@mui/material/Grid'

const DragDrop = ({ fieldName, textStyle, required }) => {
  const { t } = useTranslation()

  const [drag, setDrag] = useState(false)
  const [error, setError] = useState(false)
  const [filename, setFilename] = useState('')
  const [uploads, setUploads] = useState('')

  let dropRef = createRef()

  const fileInputRef = useRef(null)

  const upload = (name, file) => {
    return uploadFile(name, file)
      .then((response) => {
        if (response?.data?.code === 'UPLOAD_OK') {
          setUploads([response?.data?.file_hash])
        } else {
          const errorMsg = response?.data?.code
            ? response?.data?.code
            : t('GURB_UPLOAD_UNEXPECTED')
          setError(errorMsg)
        }
      })
      .catch((error) => {
        const errorMsg = error?.response?.data?.code
          ? error.response.data.code
          : t('GURB_UPLOAD_UNEXPECTED')
        setError(errorMsg)
      })
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
      onDrop(e.dataTransfer.files[0])
      setFilename(e.dataTransfer.files[0].name)
      upload(e.dataTransfer.files[0].name, e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }
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
    e.preventDefault() // Evita la navegación predeterminada
    fileInputRef.current.click() // Activa el input de archivo
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Aquí puedes manejar el archivo, como subirlo al servidor
      setError(false)
      onDrop(file)
      setFilename(file.name)
      upload(file.name, file)
    }
  }

  const onDrop = () => {}

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <RequiredTitle
          text={fieldName}
          textStyle={{ ...textStyle }}
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
              : filename
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
          ) : filename && !drag ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ ...textBody1, marginRight: '1rem' }}>
                {filename}
              </Typography>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  setFilename('')
                }}>
                <DeleteOutlineOutlinedIcon sx={{ color: 'gray' }} />
              </IconButton>
            </Box>
          ) : (
            <UploadFileIcon sx={{ marginBottom: '12px' }} color="primary" />
          )}
          <Typography sx={textBody3}>
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
          <Typography sx={textSubtitle2}>{t('GURB_TYPE_OF_FILES')}</Typography>
        </Card>
      </Grid>
    </Grid>
  )
}
export default DragDrop
