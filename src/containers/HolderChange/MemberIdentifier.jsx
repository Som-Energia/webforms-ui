import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import StepHeader from 'components/StepHeader'
import MemberIdentifierFields from 'components/MemberIdentifierFields'

function MemberIdentifier(props) {
  const { t } = useTranslation()

  return (
    <>
      <StepHeader title={t('BECOME_MEMBER_TITLE')} />
      <Box className="step-body">
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: t('HOLDER_MEMBER_IDENTIFIER_DESC')
          }}
        />
        <Box mt={0} mb={1}>
          <MemberIdentifierFields {...props} />
        </Box>
      </Box>
    </>
  )
}

export default MemberIdentifier
