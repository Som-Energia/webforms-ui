import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import DoneIcon from '@material-ui/icons/Done'

import StepHeader from '../../components/StepHeader'
import cuca from '../../images/cuca.svg'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  message: {
    marginTop: theme.spacing(2),
    fontWeight: '400',
    fontSize: '1.1rem',
    lineHeight: '1.75',
    textAlign: 'center',
    color: '#6f6262'
  },
  logo: {
    width: '240px',
    margin: theme.spacing(2)
  },
  title: {
    textAlign: 'center'
  },
  icon: {
    fontSize: '1.85rem'
  },
  success: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(3)
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
        <Avatar className={classes.success}>
          <DoneIcon fontSize="large" />
        </Avatar>

        <Typography className={classes.title} variant="h6">
          {t('SUCCESS_TEXT')}
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
