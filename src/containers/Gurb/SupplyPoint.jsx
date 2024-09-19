import { useTranslation } from 'react-i18next'

import Header from './components/Header'
import ProgressWarning from './components/ProgressWarning'
import TextRecomendation from './components/TextRecomendation'
import CUPS from './components/CUPS'

import FailureRequirement from './components/FailureRequirement'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

const SupplyPoint = (props) => {
  //   const { values, handleChange, setFieldValue } = props
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
      <CUPS />
      <FailureRequirement
        icon={<CancelOutlinedIcon sx={{ color:'#EE4949', fontSize:'50px'}}/>}
        textHeader={'test'}
        textBody={'textBody'}
        textHelper={'textHelper'}
      />
    </>
  )
}
export default SupplyPoint
