import { useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import RedirectUrl from '../../components/RedirectUrl/RedirectUrl'
import { useSyncLanguage } from '../../../../hooks/useTranslateOptions'

const GurbContractPaymentSuccessful = () => {
  const { i18n, t } = useTranslation()
  const { language } = useParams()
  const [searchParams] = useSearchParams()
  const gurbCode = searchParams.get('gurbCode')

  useSyncLanguage(language)

  return (
    <Box
      data-cy='gurb-url-ok-form'
      aria-label='gurb-url-ok-form'
      sx={{
        pt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CheckCircleIcon
        data-cy="success-icon"
        fontSize="large"
        sx={{ mb: 3, color: 'primary.extraLight' }}
      />

      <RedirectUrl
        title={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_TITLE')}
        description={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_DESCRIPTION')}
        url={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_BUTTON_URL', { gurbCode: gurbCode, language: i18n.language })}
        buttonText={t('GURB_REDIRECT_WHEN_CONTRACT_SUCCESS_BUTTON_TEXT')}
      />
    </Box>
  )
}

export default GurbContractPaymentSuccessful
