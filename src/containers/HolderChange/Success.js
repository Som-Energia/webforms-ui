import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

import StepHeader from '../../components/StepHeader'
import cuca from '../../images/cuca.svg'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    textAlign: 'center'
  },
  margin: {
    marginTop: theme.spacing(2)
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
    color: 'rgba(0, 0, 0, 0.87)'
  }
}))


function Success (props) {
  const { t } = useTranslation()
  const classes = useStyles()

  const SuccessTitle = () => <><CheckCircleOutlineIcon fontSize="large" className={classes.icon} />&nbsp; {t('SUCCESS_TEXT')}</>

  return (
    <>
      <StepHeader title={t('SUCCESS_TITLE')} />
      <div className={classes.container}>
        <Typography className={classes.title} variant="h6">
          <SuccessTitle />
        </Typography>
        <Typography className={classes.margin} variant="body1"
          dangerouslySetInnerHTML={{ __html: t('SUCCESS_NOTE') }}
        />
        <Box mt={3} mb={1}>
          <img className={classes.logo} alt="Cuca de Som Energia" src={cuca} />
        </Box>
      </div>
    </>
  )
}

export default Success
