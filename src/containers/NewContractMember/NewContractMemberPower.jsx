import {useEffect} from 'react'
import { useTranslation } from 'react-i18next'

import Powers from '../../components/Powers'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const NewContractMemberPower = (props) => {
  const {sendTrackEvent} = props

  const { t } = useTranslation()
  const trackID = 'power'

  useEffect(() => {
    sendTrackEvent(trackID)
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Typography variant="headline4.regular">{t('POWER_TITLE')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body.sm.regular" color="secondary.extraDark">{t('RECOMMENDATION_SUBTITLE')}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Powers
          {...props}
        />
      </Grid>
    </Grid>
  )
}
export default NewContractMemberPower

