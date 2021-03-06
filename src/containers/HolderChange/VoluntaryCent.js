import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'

function VoluntaryCent (props) {
  const { t } = useTranslation()

  const handleChange = ({ option }) => {
    props.setFieldValue('payment.voluntary_cent', option)
    props.validateForm()
  }

  return (
    <>
      <StepHeader title={t('VOLUNTARY_CENT_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('VOLUNTARY_CENT_PRESENTATION') }}
      />
      <Box mt={3} mb={4}>
        <Chooser
          question={t('VOLUNTARY_CENT_QUESTION')}
          onChange={handleChange}
          value={props.values.payment.voluntary_cent}
          options={[
            {
              value: true,
              label: t('VOLUNTARY_CENT_YES_LABEL'),
              description: t('VOLUNTARY_CENT_YES_DESCRIPTION')
            },
            {
              value: false,
              label: t('VOLUNTARY_CENT_NO_LABEL'),
              description: t('VOLUNTARY_CENT_NO_DESCRIPTION')
            }
          ]}
        />
      </Box>

    </>
  )
}

export default VoluntaryCent
