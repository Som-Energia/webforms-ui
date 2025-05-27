import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import Typography from '@mui/material/Typography'
import TermsDialog from '../../components/TermsDialog'

import Chooser from '../../components/NewChooser'
import InputTitle from '../../components/InputTitle'
import CUPS from '../../components/CUPS'
import AlertBox from '../../components/AlertBox'

import { iconRequirements } from '../../themes/commonStyles'

import Grid from '@mui/material/Grid'

const newContractMemberSupplyPoint = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()
  const [openLightOffDialog, setOpenLightOffDialog] = useState(false)

  const handleLightQuestion = (value) => {
    setFieldValue('has_light', value)
    if (value === 'light-off') {
      setOpenLightOffDialog(true)
    }
  }

  const handleAcceptLightOffTerms = () => {
    setOpenLightOffDialog(false)
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
      {openLightOffDialog && (
        <TermsDialog
          title={t('LIGHT_OFF_TERMS')}
          open={openLightOffDialog}
          onAccept={handleAcceptLightOffTerms}
          acceptText={'I_AGREE'}
          maxWidth="sm">
          <span
            dangerouslySetInnerHTML={{ __html: t('LIGHT_OFF_CONTRACT_TERMS') }}
          />
        </TermsDialog>
      )}
    </Grid>
  )
}

export default newContractMemberSupplyPoint
