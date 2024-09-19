import { useTranslation } from 'react-i18next'

import Header from './components/Header'
import ProgressWarning from './components/ProgressWarning'
import TextRecomendation from './components/TextRecomendation'
import CUPS from './components/CUPS'

const SupplyPoint = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <Header title={t('GURG_SUPPLY_POINT_TITLE')} />
      &nbsp;
      <ProgressWarning />
      &nbsp;
      <TextRecomendation
        title={t('GURG_SUPPLY_POINT_RECOMENDATION_TITLE')}
        text={t('GURG_SUPPLY_POINT_RECOMENDATION_TEXT')}
      />
      &nbsp;
      <CUPS {...props} />
    </>
  )
}
export default SupplyPoint
