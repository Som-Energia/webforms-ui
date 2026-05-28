import { useTranslation } from 'react-i18next'

import { Grid2 as Grid } from '@mui/material'

import SignatureIframe from '../../Signature'
import { createContractSignature } from '../../../services/api'

export const NewContractMemberSignature = (props = {}) => {
  const { leadId, onSuccess } = props
  const { t } = useTranslation()

  return (
    <>
      <Grid container direction={'column'}>
        <Grid item size={12} sx={{ textAlign: 'center', width: '100%' }}>
          <SignatureIframe
            apiFunction={createContractSignature}
            postData={leadId}
            textRecommendation={t('SIGNATURE')}
            textInfo={t('SIGNATURE_INFO')}
            onSignaturitCompleted={onSuccess}></SignatureIframe>
        </Grid>
      </Grid>
    </>
  )
}
