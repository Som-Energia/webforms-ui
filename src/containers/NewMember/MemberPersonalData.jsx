import Grid from '@mui/material/Grid'

import PersonDataPhysical from '../../components/PersonDataPhysical'
import PersonDataJuridical from '../../components/PersonDataJuridical'

const MemberPersonalData = (props) => {
  const { values } = props

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        {values?.new_member?.person_type == 'physic-person' ? (
          <PersonDataPhysical {...props} entity="new_member" />
        ) : (
          <PersonDataJuridical {...props} entity="new_member" />
        )}
      </Grid>
    </Grid>
  )
}

export default MemberPersonalData
