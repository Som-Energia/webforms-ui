import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import MemberIdentifierFields from '../../components/MemberIdentifierFields'

function BecomeMember (props) {
  const { t } = useTranslation()

//   const handleChange = ({ option }) => {
//     props.setFieldValue('member.become_member', option)
//   }

  return (
    <>
      <StepHeader title={t('BECOME_MEMBER_TITLE')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('MEMBER_IDENTIFIER_DESC') }}
      />
      <Box mt={0} mb={1}>
        <MemberIdentifierFields {...props} />
      </Box>
      {/* <Box mt={3} mb={4}> /> */}
    </>
  )
}

export default BecomeMember

