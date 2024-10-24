import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
    const gurbId = 1
    await getGurbData(gurbId)
      .then(({ data }) => {
        setGurbData({
          name: data?.name,
          state: data?.state,
          completedPercentage: data?.assigned_betas_percentage
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
    <>
      <Header title={`${t('GURB_SUPPLY_POINT_TITLE')} ${gurbData.name}`} />
      &nbsp;
      <ProgressWarning completed={gurbData.completedPercentage} />
      &nbsp;
      <TextRecomendation
        title={t('GURB_SUPPLY_POINT_RECOMENDATION_TITLE')}
        text={t('GURB_SUPPLY_POINT_RECOMENDATION_TEXT')}
      />
      &nbsp;
      <CUPS {...props} />
    </>
  )
}
export default SupplyPoint
