import { useTranslation } from 'react-i18next'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import Typography from '@mui/material/Typography'


import Chooser from '../../components/NewChooser'
import InputTitle from '../../components/InputTitle'
import CUPS from '../Gurb/components/CUPS'
import AlertBox from '../../components/AlertBox'

import { iconRequirements } from '../../themes/commonStyles'
import { iconOffRequirements } from '../Gurb/gurbTheme'

import Grid from '@mui/material/Grid'

const newContractMemberSupplyPoint = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleLightQuestion = (value) => {
    setFieldValue('has_light', value)
  }

  const options = [
    {
      id: 'light-on',
      icon: <LightbulbOutlinedIcon sx={iconRequirements} />,
      textHeader: t('LIGHT_YES'),
      textBody: t('LIGHT_MARKETER_YES')
    },
    {
      id: 'light-off',
      icon: <LightbulbOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('LIGHT_NO'),
      textBody: t('LIGHT_MARKETER_NO')
    }
  ]

  return (

    <Grid container spacing={2}>
      <Grid item xs={12}>
      <AlertBox
            id="percent_value_error"
            description={t('RECOMMENDATION_SUBTITLE')}
            severity={'warning'}
            //TODO icon={false}
            variant={'body2'}
          />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="headline3">{t('CUPS_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <CUPS {...props} />
      </Grid>
      <Grid item xs={12}>
        <InputTitle
          text={t('HAS_LIGHT_TITLE')}
          required={true}
        />
      </Grid>
      <Grid item>
        <Chooser
          name="light-question"
          options={options}
          value={values.has_light}
          handleChange={handleLightQuestion}
        />
      </Grid>
    </Grid>
  )
}

export default newContractMemberSupplyPoint
