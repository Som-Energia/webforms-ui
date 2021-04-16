import React from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import { FormHelperText } from '@material-ui/core'

const SelfConsumption = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleChange = ({ option }) => {
    props.setFieldValue('self_consumption', { have_installation: option })
    props.validateForm()
  }

  return (
    <>
      <StepHeader title={t('SELFCONSUMPTION_TITLE')} />
      <Box mt={3} mb={4}>
        <Chooser
          className={classes.chooserQuestion}
          question={t('SELFCONSUMPTION_QUESTION')}
          onChange={handleChange}
          value={props.values.self_consumption.have_installation}
          options={[
            {
              value: true,
              label: t('SELFCONSUMPTION_YES_LABEL'),
              helper: (
                <FormHelperText variant="outlined">
                  <a
                    href={t('SELFCONSUMPTION_HELP_URL')}
                    target="_blank"
                    rel="noopener noreferrer">
                    {t('SELFCONSUMPTION_HELP')}
                  </a>
                </FormHelperText>
              )
            },
            {
              value: false,
              label: t('SELFCONSUMPTION_NO_LABEL')
            }
          ]}
        />
      </Box>
    </>
  )
}

export default SelfConsumption

const useStyles = makeStyles((theme) => ({
  chooserQuestion: {
    '& h6': {
      fontWeight: 400
    },
    '& label': {
      minHeight: '80px'
    }
  }
}))
