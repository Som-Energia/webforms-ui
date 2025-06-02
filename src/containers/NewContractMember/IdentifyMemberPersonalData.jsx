import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import LegalMemberPersonalData from '../NewMember/LegalMemberPersonalData'
import PhysicalMemberPersonalData from '../NewMember/PhysicalMemberPersonalData'
import NifCif from '../../components/NifCif'

const IdentifyMemberPersonalData = (props) => {
  const { values } = props
  const { i18n, t } = useTranslation()

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">
          {t('MEMBER_PAGE_PERSONAL_DATA')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <NifCif {...props} />
      </Grid>
      <Grid item xs={12}>
      { values?.new_member?.person_type == 'physic-person'? 
        (
          <PhysicalMemberPersonalData {...props} />
        ) : values?.new_member?.person_type == 'legal-person'? 
        (
          <LegalMemberPersonalData {...props} />
        ) : null
      }
      </Grid>
    </Grid>
  )
}
export default IdentifyMemberPersonalData
