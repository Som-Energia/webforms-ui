import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'

const useStyles = makeStyles((theme) => ({
  chooserContainer: {
    '& h6': {
      fontSize: '1rem',
      marginTop: theme.spacing(2)
    }
  }
}))

function BecomeMember (props) {
  const { t } = useTranslation()
  const classes = useStyles()

  const handleChange = ({ option }) => {
    props.setFieldValue('member.become_member', option)
    props.validateForm()
  }

  return (
    <>
      <StepHeader title={t('BECOME_MEMBER_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('BECOME_MEMBER_PRESENTATION') }}
      />
      <Box mt={3} mb={4} className={classes.chooserContainer}>
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
        />
      </Box>
    </>
  )
}

export default BecomeMember
