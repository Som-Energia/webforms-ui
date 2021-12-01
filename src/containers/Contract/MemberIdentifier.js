import React from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import MemberIdentifierFields from '../../components/MemberIdentifierFields'

const MemberIdentifier = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <StepHeader title={t('CONTRACT_TITLE')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('MEMBER_IDENTIFIER_DESC') }}
      />
      <Box mt={0} mb={1}>
        <MemberIdentifierFields {...props} />
      </Box>
    </>
  )
}

export default MemberIdentifier
