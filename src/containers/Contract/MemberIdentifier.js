import React from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

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

      <Card variant="outlined">
        <CardContent >
          <div style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            gap: '1rem',
          }} >
              <Typography variant="h5" component="h2">
                <ErrorOutlineIcon />
              </Typography>
                        
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{ __html: t('DESCRIPTION_MAJ_ALERT') }}
              />
          </div>
        </CardContent>

      </Card>
    </>
  )
}

export default MemberIdentifier
