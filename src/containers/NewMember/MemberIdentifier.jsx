import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import NifCif from '../../components/NifCif'

const MemberIdentifier = (props) => {
  const {
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
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline3">{t('MEMBER_PAGE_NIF')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <NifCif {...props} />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="body.xs.regular"
          color="secondary.dark"
          dangerouslySetInnerHTML={{ __html: t('NEW_MEMBER_NO_VAT_HELP') }}
        />
      </Grid>
    </Grid>
  )
}

export default MemberIdentifier
