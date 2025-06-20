import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import LegalMemberPersonalData from './LegalMemberPersonalData'
import PhysicalMemberPersonalData from './PhysicalMemberPersonalData'

const MemberPersonalData = (props) => {
  const { values } = props
  const { i18n, t } = useTranslation()

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        {values?.new_member?.person_type == 'physic-person'?
          (
          <PhysicalMemberPersonalData {...props} />
          ) : (
            <LegalMemberPersonalData {...props} />
          )
        }
      </Grid>
    </Grid>
  )
}

export default MemberPersonalData
