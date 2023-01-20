import React from 'react'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Uploader from '../../components/Uploader'
import StepHeader from 'components/StepHeader'
import Success from '../Success'
import {
  allExtensionsValidation,
  isTextFile
} from '../../validators/FileTypeValidator'
import TermsDialog from 'components/TermsDialog'
import Alert from '@material-ui/lab/Alert'
import CircularProgress from '@material-ui/core/CircularProgress'

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

const ModDistAgreementData = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleChangeAttachment = (values, type) => {
      updateAttachment(values,type)
  }


  const {
    isDialogOpen,
    setDialogOpen,
    type9Attachment,
    type12Attachment,
    error,
    isSendingData,
    completed,
    data,
    updateAttachment,
    handleSubmitButton,
    handleSubmit
  } = props

  return (
    <Paper className={classes.paperContainer} elevation={0}>
      {completed ? (
        <Success description={t('UPDATE_AUTO_AGREEMENT_OK_DESCRIPTION')} />
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
              id={'type9-input-file'}
              callbackFn={(values) => handleChangeAttachment(values,'09')}
              values={type9Attachment}
              validTypeFiles={'UPDATE_DIST_ALL_ATTACHMENTS_INFO'}
              maxFiles={1}
              validationFileFunction={allExtensionsValidation}
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
              id={'type12-input-file'}
              callbackFn={(values) => handleChangeAttachment(values, '12')}
              values={type12Attachment}
              validTypeFiles={'INSTALL_TXT_TYPE_ATTACHMENTS_INFO'}
              uploadUrl={URL_TEXT}
              maxFiles={1}
              validationFileFunction={isTextFile}
            />
          </Box>
          <Box>{error ? <Alert id={'error-component'} severity="error">{t(error)}</Alert> : null}</Box>
          <Box className={classes.buttonContainer}>
            {!isSendingData ? (
              <Button
                id={'submit-button'}
                onClick={() => handleSubmitButton()}
                className={classes.button}
                variant="contained"
                color="primary"
                endIcon={''}>
                {t('ENVIAR')}
              </Button>
            ) : (
              <CircularProgress id={'circular-progress'} size={24} />
            )}
          </Box>
          <TermsDialog
            title={t('EMPTY_ATTACHMENTS_WARN_TITLE')}
            open={isDialogOpen}
            onAccept={() => {
              setDialogOpen(false)
              handleSubmit()
            }}
            onClose={() => setDialogOpen(false)}>
            <Typography
              variant="body1"
              component='span'
              dangerouslySetInnerHTML={{
                __html: t('EMPTY_ATTACHMENTS_WARN_DESC')
              }}
            />
          </TermsDialog>
        </>
      )}
    </Paper>
  )
}

export default React.memo(ModDistAgreementData)
