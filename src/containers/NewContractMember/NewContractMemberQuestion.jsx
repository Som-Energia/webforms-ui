import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Chooser from '../../components/NewChooser'
import InputTitle from '../../components/InputTitle'

import Typography from '@mui/material/Typography'

import Grid from '@mui/material/Grid'
import { CommunityIcon, HandshakeIcon } from '../../data/icons/Icons'

const NewContractMemberQuestion = ({ formikProps, nextStep, setValidationSchemaAndSteps, sendTrackEvent }) => {
  const { values, setFieldValue } = formikProps
  const { t } = useTranslation()
  const trackID = 'member-question'

  const handleMemberQuestion = (value) => {
    setFieldValue('has_member', value)
    nextStep(formikProps)
    setValidationSchemaAndSteps(value)
  }

  useEffect(() => {
    sendTrackEvent(trackID)
  },[])



  const options = [
    {
      id: 'member-on',
      icon: <HandshakeIcon />,
      textHeader: t('HAS_MEMBER'),
      textBody: t('HAS_MEMBER_BODY')
    },
    {
      id: 'member-off',
      icon: <CommunityIcon />,
      textHeader: t('HAS_NO_MEMBER'),
      textBody: t('HAS_NO_MEMBER_BODY')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t('CONTRACT_QUESTION_TITLE')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.sm.regular" color="secondary.extraDark">
          {t('CONTRACT_QUESTION_DESC')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.sm.regular" color="secondary.extraDark">
          {t('MEMBER_PAYMENT_INFO')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle text={t('CONTRACT_QUESTION')} required={true} />
      </Grid>
      <Grid item>
        <Chooser
          name="member-question"
          options={options}
          value={values?.has_member}
          handleChange={handleMemberQuestion}
          maxWidth="18rem"
        />
      </Grid>
    </Grid>
  )
}

export default NewContractMemberQuestion
