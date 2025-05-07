import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import VoluntaryDonation from '../../components/VoluntaryDonation'

const newContractMemberVoluntaryDonation = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  return (

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline3">{t('VOLUNTARY_CENT_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <VoluntaryDonation
          {...props}
        />
      </Grid>
    </Grid>
  )
}

export default newContractMemberVoluntaryDonation
