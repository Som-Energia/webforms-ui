import {useEffect} from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import VoluntaryDonation from '../../../components/VoluntaryDonation'

const NewContractMemberVoluntaryDonation = (props) => {
  const { sendTrackEvent } = props
  const { t } = useTranslation()

  const trackID = 'voluntary-donation'

  useEffect(() => {
    sendTrackEvent(trackID)
  }, [])

  return (

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">{t('VOLUNTARY_CENT_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <VoluntaryDonation
          {...props}
        />
      </Grid>
    </Grid>
  )
}

export default NewContractMemberVoluntaryDonation
