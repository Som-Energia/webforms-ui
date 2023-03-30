import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import CloseIcon from '@material-ui/icons/Close'

import StepHeader from '../../components/StepHeader'
import cuca from '../../images/cuca-marejada.svg'


const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  message: {
    marginTop: theme.spacing(2),
    fontWeight: '400',
    fontSize: '1rem',
    lineHeight: '1.75',
    textAlign: 'center',
    color: '#6f6262',
    '& a': {
      color: '#fe6444 !important'
    }
  },
  logo: {
    width: '220px',
    margin: theme.spacing(2)
  },
  title: {
    textAlign: 'center',
    fontSize: '1.15rem'
  },
  error: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    color: '#fe6444',
    backgroundColor: 'transparent',
    border: '2px solid #fe6444',
    marginBottom: theme.spacing(3)
  }
}))


const exceptionMap = {
    OPEN_CASES: 'INDEXED_OPEN_CASES_ERROR_TXT',
    UNAUTHORIZED: 'INDEXED_UNAUTHORIZED_ERROR_TXT',
    NO_CHANGES: 'INDEXED_NO_CHANGES_ERROR_TXT',
    NOT_FOUND: 'INDEXED_NOT_FOUND_ERROR_TXT',
    STATE_CONFLICT: 'INDEXED_STATE_CONFLICT_ERROR_TXT',
    UNDEFINED: 'INDEXED_UNDEFINED_ERROR_TXT'
}


function Failure(props) {
  const { language } = useParams()
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const {
    error = false,
    showHeader = true
  } = props

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <>
      {showHeader && <StepHeader title={t('FAILURE_TITLE')} />}
      <div className={classes.container}>
        <Avatar className={classes.error}>
          <CloseIcon fontSize="large" />
        </Avatar>
        <Typography className={classes.title} variant="h6">
          {t('FAILURE_TEXT')}
        </Typography>
        <Typography
          className={classes.message}
          variant="body1"
          dangerouslySetInnerHTML={{
            __html:
              error?.code === undefined
                ? t(exceptionMap.UNDEFINED, { url: t('CONTACT_HELP_URL') })
                : t(exceptionMap[error.code])
          }}
        />
        <Box mt={3} mb={1}>
          <img
            className={classes.logo}
            alt="Cuca KO de Som Energia"
            src={cuca}
          />
        </Box>
      </div>
    </>
  )
}

export default Failure