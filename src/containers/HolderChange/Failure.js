import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import cuca from '../../images/cuca-marejada.svg'

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
  }
}))

function Failure (props) {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <>
      <StepHeader title={t('FAILURE_TITLE')} />
      <div className={classes.container}>
        <Typography variant="h6"
          dangerouslySetInnerHTML={{ __html: t('FAILURE_TEXT') }}
        />
        <Typography className={classes.margin} variant="body1"
          dangerouslySetInnerHTML={{ __html: t('UNEXPECTED_POSTERROR') }}
        />
        <Box mt={3} mb={1}>
          <img className={classes.logo} alt="Cuca KO de Som Energia" src={cuca} />
        </Box>
      </div>
    </>
  )
}

export default Failure
