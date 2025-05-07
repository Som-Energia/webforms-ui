import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'


import Chooser from '../../components/NewChooser'
import InputTitle from '../../components/InputTitle'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import { ReceiptIcon } from '../../data/icons/Icons'

import Grid from '@mui/material/Grid'

const newContractMemberHolder = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleHolderQuestion = (value) => {
    setFieldValue('previous_holder', value)
  }

  const options = [
    {
      id: 'previous-holder-yes',
      icon: <ReceiptIcon on={true} />,
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

  const handleCheckboxChange = (event) => {
    let value = event.target.checked
    setFieldValue('som_serveis_info_accepted', value)
  }

  return (

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline3">{t('HOLDER_IDENTIFIER_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputTitle
          text={t('PREVIUOS_HOLDER_TITLE')}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="holder-question"
          options={options}
          value={values.previous_holder}
          handleChange={handleHolderQuestion}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="headline4">
          {t('SOM_SERVEIS_INFO_TITLE')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="som_serveis_info_accepted"
              checked={values?.som_serveis_info_accepted}
              onChange={handleCheckboxChange}
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('SOM_SERVEIS_INF0_ACCEPTED')
              }}
            />
          }
        />
      </Grid>
    </Grid>
  )
}

export default newContractMemberHolder
