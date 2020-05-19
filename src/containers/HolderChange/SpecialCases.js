import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3),
    color: '#96b633',
    textTransform: 'uppercase',
    fontWeight: 500
  }
}))

const SpecialCases = () => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  return (
    <>
      <StepHeader title={t('SPECIAL_CASES_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('SPECIAL_CASES_QUESTION') }}
      />
      <Box mt={3} mb={1}>
        <ul>
          <li>{t('SPECIAL_CASES_REASON_DEATH')}</li>
          <li>{t('SPECIAL_CASES_REASON_MERGE')}</li>
          <li>{t('SPECIAL_CASES_REASON_ELECTRODEP')}</li>
        </ul>
      </Box>
    </>
  )
}

export default SpecialCases
