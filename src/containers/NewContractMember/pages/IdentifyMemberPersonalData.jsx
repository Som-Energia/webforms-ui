import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import NifCif from '../../../components/NifCif/NifCif'
import PersonDataPhysical from '../../../components/PersonDataPhysical'
import PersonDataJuridical from '../../../components/PersonDataJuridical'

const IdentifyMemberPersonalData = (props) => {
  const { values, holder = false } = props
  const { t } = useTranslation()

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">
          {holder ? t('HOLDER_PERSONAL_DATA') : t('MEMBER_PAGE_PERSONAL_DATA')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <NifCif entity="new_member" {...props} holder={true} />
      </Grid>
      <Grid item xs={12}>
        {values?.new_member?.person_type == 'physic-person' ? (
          <PersonDataPhysical {...props} title={false} entity="new_member" />
        ) : values?.new_member?.person_type == 'legal-person' ? (
          <PersonDataJuridical {...props} title={false} entity="new_member" />
        ) : null}
      </Grid>
    </Grid>
  )
}
export default IdentifyMemberPersonalData
