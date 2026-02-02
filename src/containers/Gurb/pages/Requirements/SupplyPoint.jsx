import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import TextRecommendation from '../../components/TextRecommendation/TextRecommendation'
import CUPS from '../../../../components/Cups/CUPS'

const SupplyPoint = (props) => {
  const { t } = useTranslation()

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextRecommendation
          title={t('GURB_SUPPLY_POINT_RECOMENDATION_TITLE')}
          text={t('GURB_SUPPLY_POINT_RECOMENDATION_TEXT')}
          isHeader
        />
      </Grid>
      <Grid item xs={12}>
        <CUPS {...props} />
      </Grid>
    </Grid>
  )
}

export default SupplyPoint
