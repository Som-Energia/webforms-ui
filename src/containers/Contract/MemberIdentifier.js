import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import MemberIdentifierFields from '../../components/MemberIdentifierFields'
import Alert from '@material-ui/lab/Alert'

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
          <Alert severity="warning">
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
