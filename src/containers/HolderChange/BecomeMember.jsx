import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Chooser from '../../components/Chooser'
import FormHelperText from '@mui/material/FormHelperText'
import StepHeader from '../../components/StepHeader'

function BecomeMember(props) {
  const { t } = useTranslation()
  const { setFieldValue } = props

  const handleChange = ({ option }) => {
    setFieldValue('member.link_member', !option, false)
    setFieldValue('member.become_member', option)
  }

  return (
    <>
      <StepHeader title={t('BECOME_MEMBER_TITLE')} />
      <Box className="step-body">
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: t('BECOME_MEMBER_PRESENTATION') }}
          variantMapping={{ body1: 'div' }}
        />
        <Box mt={3} mb={4}>
          <Chooser
            question={t('BECOME_MEMBER_QUESTION')}
            onChange={handleChange}
            value={props.values.member.become_member}
            options={[
              {
                id: 'become-member-yes',
                value: true,
                label: t('BECOME_MEMBER_YES_LABEL'),
                description: t('BECOME_MEMBER_YES_DESCRIPTION')
              },
              {
                id: 'become-member-no',
                value: false,
                label: t('BECOME_MEMBER_NO_LABEL'),
                description: t('BECOME_MEMBER_NO_DESCRIPTION')
              }
            ]}
            canBeEmpty={false}
          />
        </Box>
        <FormHelperText
          dangerouslySetInnerHTML={{ __html: t('MEMBER_ENERGETICA_HELPER') }}
        />
      </Box>
    </>
  )
}

export default BecomeMember
