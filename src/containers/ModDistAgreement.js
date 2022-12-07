import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Uploader from '../components/Uploader'
import StepHeader from 'components/StepHeader'
import { templateData } from '../services/utils'
import { useLocation } from 'react-router-dom'
import { distribution_agreement } from '../services/api'
import Success from './Success'

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

const ModDistAgreement = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { state } = useLocation()

  const templateProps = JSON.parse(props.d1)
  const [attachments, setAttachments] = useState([])
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)

  const [data] = useState(state?.d1CaseData || templateProps)

  const handleSubmit = async () => {
    if (attachments.length === 0) {
      setError(t('EMPTY_ATTACHMENTS'))
    } else {
      console.log("DADES QUE ENVIEM",{ ...data, attachments: attachments })
      await distribution_agreement(
        { ...data, attachments: attachments },
        data.token
      )
        .then(() => setCompleted(true))
        .catch((error) => {
          const errorObj = {
            error: error?.response?.data?.error
              ? error.response.data.error
              : { code: 'MODIFY_POTTAR_UNEXPECTED' }
          }
          setError(errorObj)
        })
    }
  }

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      {completed ? (
        <Success description={t('NEWMEMBER_OK_DESCRIPTION')} />
      ) : (
        <>
          <StepHeader title={t('DETAIL_D1_TITLE')} />
          <Box mt={3} mb={1}>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: t('AUTO_PROCEDURE_INTRO', { cau: data.cau })
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
              fieldError={error.code ? t(error.code) : error}
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
        </>
      )}
    </Paper>
  )
}

export default React.memo(ModDistAgreement)
