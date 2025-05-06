import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import Powers from '../../components/Powers'

import BoltIcon from '@mui/icons-material/Bolt'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import GurbLoadingContext from '../../context/GurbLoadingContext'

import { iconRequirements } from '../../themes/commonStyles'

const NewContractMemberPower = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched
  } = props

  const { t } = useTranslation()
  const { loading, setLoading } = useContext(GurbLoadingContext)

  const handlePowerQuestion = async (value) => {
    await setFieldValue('contract.power_type', value)
    setFieldValue('contract.power', {})
  }

  const options = [
    {
      id: 'power-lower-15kw',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_POWER_LOWER_15_HEADER')
    },
    {
      id: 'power-higher-15kw',
      icon: <BoltIcon sx={iconRequirements} />,
      textHeader: t('GURB_POWER_HIGHER_15_HEADER')
    }
  ]
   
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
          <Typography variant="headline3">{t('POWER_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
          <Typography variant="subtitle2">{t('SUPPLY_POINT_DATA_SUBTITLE')}</Typography>        
      </Grid>
      <Grid item xs={12}>
          <Typography variant="subtitle4">{t('POTENCIA_A_CONTRACTAR')}</Typography>        
      </Grid>
          <Grid item xs={12} sm={12}>
          <Powers
            {...props}
          />
       </Grid>
       </Grid>
          )
    }
  export default NewContractMemberPower
        
