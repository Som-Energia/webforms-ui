import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import LegalMemberPersonalData from '../NewMember/LegalMemberPersonalData'
import PhysicalMemberPersonalData from '../NewMember/PhysicalMemberPersonalData'
import NifCif from '../../components/NifCif'

const IdentifyMemberPersonalData = (props) => {
  const { values, holder = false } = props
  const { i18n, t } = useTranslation()

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">
          {holder
            ? t('HOLDER_PERSONAL_DATA')
            : t('MEMBER_PAGE_PERSONAL_DATA')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <NifCif {...props} holder={true} />
      </Grid>
      <Grid item xs={12}>
        {values?.new_member?.person_type == 'physic-person' ? (
          <PhysicalMemberPersonalData {...props} title={false} />
        ) : values?.new_member?.person_type == 'legal-person' ? (
          <LegalMemberPersonalData {...props} title={false} />
        ) : null}
      </Grid>
    </Grid>
  )
}
export default IdentifyMemberPersonalData
