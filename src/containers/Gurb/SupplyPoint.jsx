import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import TextRecomendation from './components/TextRecomendation'
import CUPS from '../../components/CUPS'


const SupplyPoint = (props) => {
  const { t } = useTranslation()

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextRecomendation
          title={t('GURB_SUPPLY_POINT_RECOMENDATION_TITLE')}
          text={t('GURB_SUPPLY_POINT_RECOMENDATION_TEXT')}
        />
      </Grid>
      <Grid item xs={12}>
        <CUPS {...props} />
      </Grid>
    </Grid>
  )
}

export default SupplyPoint
