import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Uploader from '../components/Uploader'
import StepHeader from 'components/StepHeader'
import { useLocation, useParams } from 'react-router-dom'
import { distribution_agreement } from '../services/api'
import Success from './Success'
import {
  allExtensionsValidation,
  isTextFile
} from '../validators/FileTypeValidator'

import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

const URL_TEXT = '/form/upload_txt_attachment/1'

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
  const { t, i18n } = useTranslation()
  const { state } = useLocation()
  const { language } = useParams()

  const templateProps = JSON.parse(props.d1)
  const [type9Attachment, setType9Attachment] = useState([])
  const [type12Attachment, setType12Attachment] = useState([])
  const [errorType9, setErrorType9] = useState()
  const [errorType12, setErrorType12] = useState()
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)

  const [data] = useState(state?.d1CaseData || templateProps)

  const handleSubmit = async () => {
    if ([...type9Attachment, ...type12Attachment].length === 0) {
      setError('EMPTY_ATTACHMENTS')
    } else {
      await distribution_agreement(
        {
          ...data,
          rich_attachments: [...type9Attachment, ...type12Attachment]
        },
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

  const validateFileTypes = (values, validateFunc) => {
    return values.reduce(function (init, a) {
      return init && validateFunc(a)
    }, true)
  }

  const handleChangeAttachment = (values, validateFunc, type) => {
    setError('')
    if (validateFileTypes(values, validateFunc)) {
      type === "09"
        ? setType9Attachment(values.map((el) => ({ type: type, data: el })))
        : setType12Attachment(values.map((el) => ({ type: type, data: el })))
    } else {
      type === "09"
        ? setErrorType9({ code: 'INSTALL_TYPE_ATTACHMENTS_INFO' })
        : setErrorType12({ code: 'INSTALL_TXT_TYPE_ATTACHMENTS_INFO' })
    }
  }

  useEffect(() => {
    console.log(i18n)
    i18n.changeLanguage(language)
  }, [language, i18n])

  useEffect(() => {
    if(errorType9){
      setType9Attachment([])
    }
    else if (errorType12){
      setType12Attachment([])
    }
  }, [errorType9,errorType12])

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
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: t('AUTO_AGRREEMENT_DIST_FILE')
              }}
            />
            <Uploader
              fieldError={errorType9?.code}
              callbackFn={(values) => handleChangeAttachment(values, allExtensionsValidation, "09")}
              values={type9Attachment}
              validateFunction={allExtensionsValidation}
              maxFiles={1}
            />
          </Box>

          <Box mt={1} mb={2}>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: t('AUTO_COEF_DIST_FILE')
              }}
            />
            <Uploader
              fieldError={errorType12?.code}
              callbackFn={(values) => handleChangeAttachment(values, isTextFile, "12")}
              values={type12Attachment}
              validTypeFiles={'INSTALL_TXT_TYPE_ATTACHMENTS_INFO'}
              uploadUrl={URL_TEXT}
              validateFunction={isTextFile}
              maxFiles={1}
            />
          </Box>
          <Box>
            {error ? (
              <Alert severity="error">{t(error.code ? error.code : error)}</Alert>
            ) : null}
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
