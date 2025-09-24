import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import RedirectUrl from '../../../../containers/Gurb/components/RedirectUrl'

const GurbRequirementsResult = ({ values, gurbCode }) => {
  const { t } = useTranslation()
  const { new_contract, redirectUrl } = values

  const resultTitle = new_contract
    ? t('GURB_REQUIREMENTS_RESULT_TITLE_NEW_MEMBER')
    : t('GURB_REQUIREMENTS_RESULT_TITLE_EXISTING_MEMBER')

  const resultDescription = new_contract
    ? t('GURB_REQUIREMENTS_RESULT_DESCRIPTION_NEW_MEMBER')
    : t('GURB_REQUIREMENTS_RESULT_DESCRIPTION_EXISTING_MEMBER')

  const resultRedirectUrl = redirectUrl ?? t('GURB_REDIRECT_JOIN_FORM_URL', { gurbCode: gurbCode })

  const resultButtonText = new_contract
    ? t('GURB_REQUIREMENTS_RESULT_BUTTON_TEXT_NEW_MEMBER')
    : t('GURB_REQUIREMENTS_RESULT_BUTTON_TEXT_EXISTING_MEMBER')

  return (
    <Box
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
        title={resultTitle}
        description={resultDescription}
        url={resultRedirectUrl}
        buttonText={resultButtonText}
      />
    </Box>
  )
}

GurbRequirementsResult.propTypes = {
  values: PropTypes.shape({
    new_contract: PropTypes.bool.isRequired,
    redirectUrl: PropTypes.string,
  }).isRequired,
}

export default GurbRequirementsResult
