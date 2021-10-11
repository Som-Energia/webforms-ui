import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import Chooser from '../../components/Chooser'
import MemberIdentifierFields from '../../components/MemberIdentifierFields'

const useStyles = makeStyles((theme) => ({}))

const MemberIdentifier = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const { values, handleBlur, handleChange, errors, touched, setFieldValue } =
    props

  const handleChooser = (event) => {
    setFieldValue('member.is_member', !!event?.option)
  }

  return (
    <>
      <StepHeader title={t('CONTRIBUTION')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: t('CONTRIBUTION_MEMBER_IDENTIFIER_DESC')
        }}
      />
      <Box pt={0} mb={1}>
        <Chooser
          question={t('CONTRIBUTION_MEMBER_QUESTION')}
          onChange={handleChooser}
          condensed={true}
          value={values?.member?.is_member}
          canBeEmpty={false}
          options={[
            {
              value: true,
              label: t('CONTRIBUTION_MEMBER_YES')
            },
            {
              value: false,
              label: t('CONTRIBUTION_MEMBER_NO')
            }
          ]}
        />
      </Box>

      {values?.member?.is_member ? (
        <Box mt={2} mb={2}>
          <MemberIdentifierFields {...props} />
        </Box>
      ) : (
        <Box mt={3} mb={3}>
          <Alert severity="warning">
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: t('CONTRIBUTION_MEMBER_WARNING')
              }}
            />
          </Alert>
        </Box>
      )}
    </>
  )
}

export default MemberIdentifier
