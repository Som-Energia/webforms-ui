import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import RedirectUrl from '../../../../containers/Gurb/components/RedirectUrl'

const GurbRequirementsResult = ({ values }) => {
  const { t } = useTranslation()
  const { new_member, redirectUrl } = values

  const resultTitle = new_member
    ? t('GURB_REQUIREMENTS_RESULT_TITLE_NEW_MEMBER')
    : t('GURB_REQUIREMENTS_RESULT_TITLE_EXISTING_MEMBER')

  const resultDescription = new_member
    ? t('GURB_REQUIREMENTS_RESULT_DESCRIPTION_NEW_MEMBER')
    : t('GURB_REQUIREMENTS_RESULT_DESCRIPTION_EXISTING_MEMBER')

  const resultRedirectUrl = redirectUrl ?? 'http://localhost:3000/ca/gurb/2/join/'

  const resultButtonText = new_member
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
    new_member: PropTypes.bool.isRequired,
    redirectUrl: PropTypes.string,
  }).isRequired,
}

export default GurbRequirementsResult
