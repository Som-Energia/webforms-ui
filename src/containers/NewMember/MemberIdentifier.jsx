import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import NifCif from '../../components/NifCif'

const MemberIdentifier = (props) => {
  
  const { t } = useTranslation()

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="headline4.regular">
          {t('MEMBER_PAGE_NIF')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <NifCif {...props} />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="body.xs.regular"
          color="secondary.extraDark"
          sx={{
            [`& a[href='${t('NEW_MEMBER_NO_VAT_HELP_URL')}']`]: {
              color: "link.main",
              textDecoration: 'underline'
            }
          }}
          dangerouslySetInnerHTML={{
            __html: t('NEW_MEMBER_NO_VAT_HELP', {
              url: t('NEW_MEMBER_NO_VAT_HELP_URL'),
              text: t('NEW_MEMBER_NO_VAT_HELP_TEXT')
            })
          }}
        />
      </Grid>
    </Grid>
  )
}

export default MemberIdentifier
