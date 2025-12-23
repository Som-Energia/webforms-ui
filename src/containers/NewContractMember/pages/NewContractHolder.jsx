import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'

import Chooser from '../../../components/Chooser'
import InputTitle from '../../../components/InputTitle'

import { ReceiptIcon } from '../../../data/icons/Icons'

import Grid from '@mui/material/Grid'

const newContractHolder = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleHolderQuestion = (value) => {
    setFieldValue('previous_holder', value)
  }
  const options = [
    {
      id: 'previous-holder-yes',
      icon: <ReceiptIcon />,
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t('HOLDER_IDENTIFIER_TITLE')}
        </Typography>
      </Grid>
        <>
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
        </>
    </Grid>
  )
}

export default newContractHolder
