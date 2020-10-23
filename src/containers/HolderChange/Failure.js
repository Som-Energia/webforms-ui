import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import cuca from '../../images/cuca-marejada.svg'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    textAlign: 'center'
  },
  message: {
    marginTop: theme.spacing(2),
    color: '#dc4338',
    fontWeight: '500',
    lineHeight: '1.75'
  },
  logo: {
    width: '300px',
    margin: theme.spacing(2)
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: '1.85rem'
  }
}))

function Failure (props) {
  const { t } = useTranslation()
  const classes = useStyles()
  const { error } = props

  const FailureTitle = () => (
    <>
      <span className={classes.icon} role="img" aria-label="error">🙈</span>&nbsp; {t('FAILURE_TEXT')}
    </>
  )

  return (
    <>
      <StepHeader title={t('FAILURE_TITLE')} />
      <div className={classes.container}>
        <Typography className={classes.title} variant="h6">
          <FailureTitle />
        </Typography>
        <Typography className={classes.message} variant="body1"
          dangerouslySetInnerHTML={{ __html: t('UNEXPECTED_POSTERROR', { error_message: error?.code ? t(error?.code) : error?.error }) }}
        />
        <Box mt={3} mb={1}>
          <img className={classes.logo} alt="Cuca KO de Som Energia" src={cuca} />
        </Box>
      </div>
    </>
  )
}

export default Failure
