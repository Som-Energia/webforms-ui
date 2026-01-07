import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Chooser from '../../components/OldComponents/Chooser'
import FormHelperText from '@mui/material/FormHelperText'
import StepHeader from '../../components/OldComponents/StepHeader'

function BecomeMember(props) {
  const { t } = useTranslation()
  const {
    values,
    setFieldValue,
    isMemberMandatoryForHolderchange = false
  } = props

  const handleChange = ({ option }) => {
    setFieldValue('member', {
      ...values.member,
      become_member: option,
      // When become member is true, link member must be false.
      // When member is not mandatory for holderchange, we set the link member to undefined
      // because it is set in another page.
      link_member: isMemberMandatoryForHolderchange || option === true
        ? !option
        : undefined
    })
  }

  return (
    <>
      <StepHeader title={ isMemberMandatoryForHolderchange ? t('BECOME_MEMBER_TITLE') : t('BECOME_MEMBER_QUESTION')} />
      <Box className="step-body">
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: t('BECOME_MEMBER_PRESENTATION') }}
          variantMapping={{ body1: 'div' }}
        />
        <Box mt={3} mb={4}>
          <Chooser
            question={ isMemberMandatoryForHolderchange ? t('BECOME_MEMBER_QUESTION') : ''}
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
                description: isMemberMandatoryForHolderchange && t('BECOME_MEMBER_NO_DESCRIPTION')
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
