import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

import StepHeader from '../../components/StepHeader'
import cuca from '../../images/cuca.svg'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    textAlign: 'center'
  },
  message: {
    marginTop: theme.spacing(2),
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

const Success = (props) => {
  const { result } = props
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <>
      <StepHeader title={t('SUCCESS_TITLE')} />
      <div className={classes.container}>
        <Typography className={classes.title} variant="h6">
          <span className={classes.icon} role="img">🎉</span>&nbsp; {t('SUCCESS_TEXT')}
        </Typography>
        <Typography className={classes.message} variant="body1"
          dangerouslySetInnerHTML={{ __html: t('SUCCESS_NOTE', result) }}
        />
        <Box mt={3} mb={1}>
          <img className={classes.logo} alt="Cuca de Som Energia" src={cuca} />
        </Box>
      </div>
    </>
  )
}

export default Success
