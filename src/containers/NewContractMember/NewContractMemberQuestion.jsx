import { useTranslation } from 'react-i18next'

import Chooser from '../../components/NewChooser'
import InputTitle from '../../components/InputTitle'

import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import Typography from '@mui/material/Typography'

import { iconRequirements } from '../../themes/commonStyles'
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined'
import Grid from '@mui/material/Grid'

const NewContractMemberQuestion = ({ formikProps, nextStep }) => {
  const { values, setFieldValue } = formikProps
  const { t } = useTranslation()

  const handleMemberQuestion = (value) => {
    setFieldValue('has_member', value)
    nextStep(formikProps)
  }

  const options = [
    {
      id: 'member-on',
      icon: <HandshakeOutlinedIcon sx={iconRequirements} />,
      textHeader: t('HAS_MEMBER'),
      textBody: t('HAS_MEMBER_BODY')
    },
    {
      id: 'member-off',
      icon: <Diversity1OutlinedIcon sx={iconRequirements} />,
      textHeader: t('HAS_NO_MEMBER'),
      textBody: t('HAS_NO_MEMBER_BODY')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline3">
          {t('CONTRACT_QUESTION_TITLE')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.sm.regular" color="secondary.dark">
          {t('CONTRACT_QUESTION_DESC')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body.sm.regular" color="secondary.dark">
          {t('MEMBER_PAYMENT_INFO')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle text={t('CONTRACT_QUESTION')} required={true} />
      </Grid>
      <Grid item>
        <Chooser
          name="member-question"
          options={options}
          value={values.has_member}
          handleChange={handleMemberQuestion}
        />
      </Grid>
    </Grid>
  )
}

export default NewContractMemberQuestion
