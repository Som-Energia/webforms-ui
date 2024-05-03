import React from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'

const SelfConsumption = (props) => {
  const { t } = useTranslation()

  const handleChange = ({ option }) => {
    props.setFieldValue('self_consumption.have_installation', option)
  }

  return (
    <>
      <StepHeader title={t('SELFCONSUMPTION_TITLE')} />
      <Box mt={3} mb={2}>
        <Chooser
          sx={{
            '& h6': {
              fontWeight: 400
            },
            '& label': {
              minHeight: '80px'
            }
          }}
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
