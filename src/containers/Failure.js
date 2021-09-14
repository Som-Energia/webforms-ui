import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import CloseIcon from '@material-ui/icons/Close'

import StepHeader from '../components/StepHeader'
import cuca from '../images/cuca-marejada.svg'

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
    color: '#6f6262'
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

function Failure(props) {
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const { error = false, description = 'NEWMEMBER_KO_DESCRIPTION' } = props

  useEffect(() => {
    const language = props?.match?.params?.language
    language && i18n.changeLanguage(language)
  }, [props?.match?.params?.language, i18n])

  return (
    <>
      <StepHeader title={t('FAILURE_TITLE')} />
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
                ? t(description, { url: t('CONTACT_HELP_URL') })
                : error?.code === 'INVALID_FIELD' && error?.data?.[0]?.field
                ? i18n.exists(error?.data?.[0]?.field.toUpperCase())
                  ? t(error?.data?.[0]?.field.toUpperCase())
                  : t('INVALID_FIELD', { field_name: error?.data?.[0]?.field })
                : t('UNEXPECTED_POSTERROR', {
                    error_message: error?.code ? t(error?.code) : error?.error
                  })
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
