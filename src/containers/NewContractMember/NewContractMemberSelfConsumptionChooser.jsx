import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'

import Chooser from '../../components/NewChooser'
import Typography from '@mui/material/Typography'
import InputTitle from '../../components/InputTitle'

import { SolarpanelIcon } from '../../data/icons/Icons'

const NewContractMemberSelfConsumptionChooser = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleSelfconsumptionQuestion = (value) => {
    setFieldValue('has_selfconsumption', value)
  }

  const options = [
    {
      id: 'selfconsumption-on',
      icon: <SolarpanelIcon/>,
      textHeader: t('SELFCONSUMPTION_YES_HEADER'),
    },
    {
      id: 'selfconsumption-off',
      icon: <SolarpanelIcon on={false}/>,
      textHeader: t('SELFCONSUMPTION_NO_HEADER'),
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Typography variant="headline4.regular">
            {t('SELFCONSUMPTION_TITLE')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body.md.regular" color="secondary.dark">
            {t('RECOMMENDATION_SUBTITLE')}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <InputTitle
            variant="subtitle4"
            text={t('SELFCONSUMPTION_ACTIVE')}
            required={true}
          />
          <Typography variant="body.md.regular" color="secondary.dark">
          {t('SELFCONSUMPTION_HELPER')}
        </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 1 }}>
        <Chooser
          name="selfconsumption-question"
          options={options}
          value={values.has_selfconsumption}
          handleChange={handleSelfconsumptionQuestion}
          maxWidth="12rem"
        />
      </Grid>
      {values.has_selfconsumption === 'selfconsumption-on' && (
        <Grid item xs={12}>
          <Typography variant="body.md.regular" color="secondary.dark">
            {t('SELFCONSUMPTION_WARNING')}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default NewContractMemberSelfConsumptionChooser
