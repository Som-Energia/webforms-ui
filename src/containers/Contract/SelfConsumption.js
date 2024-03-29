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
    props.setFieldValue('self_consumption.have_installation', option)
  }

  return (
    <>
      <StepHeader title={t('SELFCONSUMPTION_TITLE')} />
      <Box mt={3} mb={2}>
        <Chooser
          className={classes.chooserQuestion}
          question={t('SELFCONSUMPTION_QUESTION')}
          onChange={handleChange}
          value={props.values.self_consumption.have_installation}
          canBeEmpty={false}
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
        {props.values.self_consumption.have_installation && (
          <Box mt={3} mb={0}>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{ __html: t('SELFCONSUMPTION_WARNING') }}
            />
          </Box>
        )}
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
