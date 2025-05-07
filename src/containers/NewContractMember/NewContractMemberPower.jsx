import { useTranslation } from 'react-i18next'

import Powers from '../../components/Powers'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
          <Typography variant="headline3">{t('POWER_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
          <Typography variant="subtitle2">{t('RECOMMENDATION_SUBTITLE')}</Typography>
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
        
