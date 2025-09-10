import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslation } from 'react-i18next'

import RedirectUrl from '../../../../containers/Gurb/components/RedirectUrl'

const GurbRequirementsResult = () => {
  const { t } = useTranslation()
  const title = 'rrrrrr'
  const description = 'rrrrrr'

  return (
    <Box
      sx={{
        pt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>

      <CheckCircleIcon
        data-cy="success-icon"
        fontSize="large"
        sx={{ mb: 3, color: 'primary.extraLight' }}
      />

      <RedirectUrl
        title={title}
        description={description}
        url="https://somenergia.coop"
      />
    </Box>
  )

}

export default GurbRequirementsResult
