import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'

function VoluntaryCent(props) {
  const { t } = useTranslation()

  const handleChange = ({ option }) => {
    props.setFieldValue('payment.voluntary_cent', option)
  }

  return (
    <>
      <StepHeader title={t('VOLUNTARY_CENT_TITLE')} />
      <Box className="step-body">
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: t('VOLUNTARY_CENT_PRESENTATION') }}
        />
        <Box mt={3} mb={4}>
          <Chooser
            question={t('VOLUNTARY_CENT_QUESTION')}
            onChange={handleChange}
            value={props.values.payment.voluntary_cent}
            canBeEmpty={false}
            options={[
              {
                id: 'voluntary-cent-yes',
                value: true,
                label: t('VOLUNTARY_CENT_YES_LABEL'),
                description: t('VOLUNTARY_CENT_YES_DESCRIPTION')
              },
              {
                id: 'voluntary-cent-no',
                value: false,
                label: t('VOLUNTARY_CENT_NO_LABEL'),
                description: t('VOLUNTARY_CENT_NO_DESCRIPTION')
              }
            ]}
          />
        </Box>
      </Box>
    </>
  )
}

export default VoluntaryCent
