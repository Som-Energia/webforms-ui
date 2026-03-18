import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Chooser from '../../../components/Chooser/Chooser'
import TemporalOption from '../../../components/Chooser/TemporalOption'
import InputTitle from '../../../components/InputTitle'

import Typography from '@mui/material/Typography'

import Grid from '@mui/material/Grid'
import { CommunityIcon, HandshakeIcon, GiftIcon } from '../../../data/icons/Icons'

const NewContractMemberQuestion = ({
  formikProps,
  nextStep,
  setValidationSchemaAndSteps,
  sendTrackEvent
}) => {
  const { values, setFieldValue, setValues } = formikProps
  const { t } = useTranslation()
  const trackID = 'member-question'
  const [campaignOffer, setCampaignOffer] = useState(false)
  const [hasMember, setHasMember] = useState(false)
  const CampaignIsEnabled = JSON.parse(import.meta.env.VITE_FEATURE_FLAGS)?.is15CampaignEnabled;

  const handleMemberQuestion = (value) => {
    if (value == "campaign-offer") {
      setCampaignOffer(true)
      setValues({
        ...values,
        has_member: 'campaign-offer',
        member: {
          number: 1,
          nif: '11111111H'
        }
      })
    }
    else {
      setCampaignOffer(false)
      setFieldValue('has_member', value)
    }
    setHasMember(value)
  }

  useEffect(() => {
    if (hasMember) {
      nextStep(formikProps)
      setValidationSchemaAndSteps(hasMember)
    }
  }, [hasMember])

  useEffect(() => {
    sendTrackEvent(trackID)
    setValues({
      ...values,
      member: {
        number: '',
        nif: ''
      }
    })
  }, [])

  const options = [
    {
      id: 'member-on',
      icon: <CommunityIcon />,
      textHeader: t('HAS_MEMBER'),
      textBody: t('HAS_MEMBER_BODY')
    },
    {
      id: 'member-link',
      icon: <HandshakeIcon />,
      textHeader: t('HAS_LINK_MEMBER'),
      textBody: t('HAS_LINK_MEMBER_BODY')
    },
    {
      id: 'member-off',
      icon: <CommunityIcon on={false} />,
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
        {CampaignIsEnabled ? (
          <Grid
            container
            direction="row"
            mt={4}
            justifyContent="center">
            <Grid item justifyContent="center" xs={12} sm={12} md={8} lg={12}>
              <TemporalOption
                optionId="campaign-offer"
                icon={<GiftIcon />}
                isSelected={values?.has_member == "campaign-offer"}
                setSelected={handleMemberQuestion}
                textHeader={t('15YEARS_CAMPAIGN')}
                textBody={t('15YEARS_DESCRIPTION')}
                maxWidth="18rem"
              />
            </Grid>
          </Grid>) : null}
      </Grid>
    </Grid>
  )
}

export default NewContractMemberQuestion