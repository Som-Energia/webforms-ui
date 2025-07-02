import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import PersonIcon from '@mui/icons-material/Person'

import Chooser from '../../components/NewChooser'
import InputTitle from '../../components/InputTitle'
import { iconRequirements } from '../../themes/commonStyles'
import { iconOffRequirements } from '../Gurb/gurbTheme'

import { ReceiptIcon } from '../../data/icons/Icons'

import Grid from '@mui/material/Grid'

const newContractMemberHolder = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleHolderQuestion = (value) => {
    setFieldValue('previous_holder', value)
  }

  const handleMemberIsHolderQuestion = (value) => {
    setFieldValue('member_is_holder', value)
  }

  const options = [
    {
      id: 'previous-holder-yes',
      icon: <ReceiptIcon/>,
      textHeader: t('PREVIOUS_HOLDER_YES_LABEL'),
      textBody: t('PREVIOUS_HOLDER_YES_DESC')
    },
    {
      id: 'previous-holder-no',
      icon: <ReceiptIcon on={false} />,
      textHeader: t('PREVIOUS_HOLDER_NO_LABEL'),
      textBody: t('PREVIOUS_HOLDER_NO_DESC')
    }
  ]

  const holder_member_options = [
    {
      id: 'holder-member-yes',
      icon: <PersonIcon sx={iconRequirements} />,
      textHeader: t('NEW_HOLDER_SAME_TITLE'),
      textBody: t('NEW_HOLDER_SAME_HELPER')
    },
    {
      id: 'holder-member-no',
      icon: <PersonIcon sx={iconOffRequirements} />,
      textHeader: t('NEW_HOLDER_DIFFERENT_TITLE'),
      textBody: t('NEW_HOLDER_DIFFERENT_HELPER')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">{t('HOLDER_IDENTIFIER_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle text={t('PREVIUOS_HOLDER_TITLE')} required={true} />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="holder-question"
          options={options}
          value={values.previous_holder}
          handleChange={handleHolderQuestion}
        />
      </Grid>
      {values?.has_member === 'member-on' && (
        <>
          <Grid item xs={12}>
            <InputTitle text={t('NEW_HOLDER_TITLE')} required={true} />
          </Grid>
          <Grid item xs={12}>
            <Chooser
              name="holder-member-question"
              options={holder_member_options}
              value={values.member_is_holder}
              handleChange={handleMemberIsHolderQuestion}
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default newContractMemberHolder
