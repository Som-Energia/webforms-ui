import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Grid2 as Grid } from '@mui/material'

import SignatureIframe from '../../Signature'
import { getContractSignature } from '../../../services/api'
import MatomoContext from '../../../trackers/matomo/MatomoProvider'

export const NewContractMemberSignature = (props = {}) => {
  const { leadId, cups, onSuccess } = props
  const { t } = useTranslation()
  const { trackEvent } = useContext(MatomoContext)

  const handleCreateSignature = (data) => {
    if (!data?.signaturit_url) {
      return
    }

    trackEvent({
      category: 'NewContractMemberFunnel',
      action: 'signatureCreation',
      name: 'new-contract-member-signature-creation'
    })
  }

  return (
    <>
      <Grid container direction={'column'}>
        <Grid item size={12} sx={{ textAlign: 'center', width: '100%' }}>
          <SignatureIframe
            apiFunction={getContractSignature}
            postData={{ leadId, cups }}
            textRecommendation={t('SIGNATURE')}
            textInfo={t('SIGNATURE_INFO')}
            errorDescription={t('CONTRACT_SIGNATURE_ERROR_DESCRIPTION')}
            onCreateSignature={handleCreateSignature}
            onSignaturitCompleted={onSuccess}>
          </SignatureIframe>
        </Grid>
      </Grid>
    </>
  )
}
