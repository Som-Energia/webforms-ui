import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'

function BecomeMember (props) {
  const { t } = useTranslation()

  const handleClick = (event) => {
    event.preventDefault()
    props.setFieldValue('member.become_member', !props?.values?.member?.become_member)
  }

  return (
    <>
      <StepHeader title={t('BECOME_MEMBER_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('BECOME_MEMBER_PRESENTATION') }}
      />
      <Box mt={3} mb={4}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                id="legal_person_accepted"
                color="primary"
                name="legal_person_accepted"
                onClick={handleClick}
                checked={props?.values?.member?.become_member}
              />
            }
            label={t('LEGAL_PERSON_TITLE_LABEL')}
          />
        </FormGroup>
      </Box>
    </>
  )
}

export default BecomeMember
