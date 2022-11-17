import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Uploader from '../components/Uploader'

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  paperContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  }
}))

const ModDistAgreement = ({ cau }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [attachments, setAttachments] = useState([])
  const [error,setError] = useState('')


  const handleSubmit = () => {
    if(attachments.length === 0){
      setError(t('EMPTY_ATTACHMENTS'))
    }else{
      
    }
  }

  return (
    <Paper className={classes.paperContainer} elevation={0}>
        <Box mt={3} mb={1}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: t('AUTO_PROCEDURE_INTRO', { cau: cau })
            }}
          />
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: t('AUTO_PROCEDURE_DOCS')
            }}
          />
        </Box>
        <Box mt={1} mb={2}>
          <Uploader
            fieldError={error}
            callbackFn={(values) => setAttachments(values)}
            values={attachments}
            maxFiles={5}
          />
        </Box>
        <Box className={classes.buttonContainer}>
          <Button
            onClick={handleSubmit}
            className={classes.button}
            variant="contained"
            color="primary"
            endIcon={''}>
            {t('ENVIAR')}
          </Button>
        </Box>
    </Paper>
  )
}

export default React.memo(ModDistAgreement)
