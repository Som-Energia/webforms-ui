import {useEffect} from 'react'
import { useTranslation } from 'react-i18next'

import Powers from '../../components/Powers'
import SelectField from '../../components/SelectField'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const NewContractMemberPower = (props) => {
  const {sendTrackEvent, values} = props

  const { t } = useTranslation()
  const trackID = 'power'

  useEffect(() => {
    sendTrackEvent(trackID)
  }, [])

  const phase_options = {
    mono: t('PHASE_MONO'),
    tri: t('PHASE_TRI'),
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid item xs={12}>
            <Typography variant="headline4.regular">
              { values?.has_light === 'light-on'
                ? t('POWER_TITLE')
                : t('TENSION_AND_POWER')
              }
            </Typography>
        </Grid>
        { values?.has_light === 'light-off' && (
          <Grid item xs={12} sm={12}>
            <SelectField
              label={t('TIPUS_INSTALLACIO_CONTRACTACIO')}
              value={values?.contract?.phase}
              fieldName="contract.phase"
              options={phase_options}
              {...props}
            />
          </Grid>
          )
        }
        <Grid item xs={12}>
            <Typography variant="body.sm.regular" color="secondary.extraDark">
              { values?.has_light === 'light-on'
                ? t('RECOMMENDATION_SUBTITLE')
                : ''
              }
            </Typography>
        </Grid>
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

