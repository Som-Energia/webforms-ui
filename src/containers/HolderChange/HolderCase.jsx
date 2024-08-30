import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'

function HolderCase(props) {
  const { t } = useTranslation()
  const { setFieldValue } = props

  const handleChange = ({ option }) => {
    setFieldValue('member.link_member', option)
  }

  return (
    <>
      <StepHeader title={ t('HOLDER_CASE_TITLE')} />
      <Box className="step-body">
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: t('HOLDER_CASE_PRESENTATION') }}
          variantMapping={{ body1: 'div' }}
        />
        <Box mt={3} mb={4}>
          <Chooser
            onChange={handleChange}
            value={props.values.member.link_member}
            options={[
              {
                id: 'holder-case-link-member',
                value: true,
                label: t('HOLDER_CASE_YES_LABEL'),
              },
              {
                id: 'holder-case-pass',
                value: false,
                label: t('HOLDER_CASE_NO_LABEL'),
              }
            ]}
            canBeEmpty={false}
          />
        </Box>
      </Box>
    </>
  )
}

export default HolderCase
