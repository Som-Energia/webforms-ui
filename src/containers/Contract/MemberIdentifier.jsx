import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import StepHeader from '../../components/StepHeader'
import MemberIdentifierFields from '../../components/MemberIdentifierFields'
import Alert from '@mui/material/Alert'

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
      {!props.is30ContractEnabled ? (
        <Box mt={0} mb={1}>
          <Alert severity="warning" data-cy="warning-alert">
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: t('TARIFF_NOT_AVAILABLE')
              }}
            />
          </Alert>
        </Box>
      ) : null}
    </>
  )
}

export default MemberIdentifier
