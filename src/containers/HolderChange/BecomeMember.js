import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Chooser from '../../components/Chooser'
import FormHelperText from '@material-ui/core/FormHelperText'
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
                value: true,
                label: t('BECOME_MEMBER_YES_LABEL'),
                description: t('BECOME_MEMBER_YES_DESCRIPTION')
              },
              {
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
