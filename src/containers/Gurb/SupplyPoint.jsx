import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Header from './components/Header'
import ProgressWarning from './components/ProgressWarning'
import TextRecomendation from './components/TextRecomendation'
import CUPS from './components/CUPS'
import { getGurbData } from '../../services/apiGurb'

const SupplyPoint = (props) => {
  const { t } = useTranslation()
  const [gurbData, setGurbData] = useState({})

  const handleGurbData = async () => {
    // TODO: gurb id from where?
    const gurbId = 2
    await getGurbData(gurbId)
      .then(({ data }) => {
        setGurbData({
          name: data?.name,
          state: data?.state,
          completedPercentage: data?.completed_percentage
        })
      })
      .catch((error) => {
        // TODO: handle errors
        console.log('ERROR:', error)
      })
  }

  useEffect(() => {
    handleGurbData()
  }, [])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Header title={`${t('GURB_SUPPLY_POINT_TITLE')} ${gurbData.name}`} />
      </Grid>
      <Grid item xs={12}>
        <ProgressWarning completed={gurbData.completedPercentage} />
      </Grid>
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
