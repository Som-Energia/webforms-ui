import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Grid2 as Grid } from '@mui/material'

import SignatureIframe from '../../Signature'
import { createSignature } from '../../../services/api'
import { newNormalizeContract } from '../../../services/newNormalize'

export const NewContractMemberSignature = (props = {}) => {
  const { values, gurbCode, onCreate, onSuccess } = props
  const { t } = useTranslation()

  const postData = useMemo(
    () => newNormalizeContract(values, gurbCode),
    [values, gurbCode]
  )

  // FIXME: remove in production and use onCreate directly
  const onCreateSignatureHandler = (response) => {
    if (!response) {
      return
    }

    onCreate(response || {})
    onSuccess()
  }

  return (
    <>
      <Grid container direction={'column'}>
        <Grid item size={12} sx={{ textAlign: 'center', width: '100%' }}>
          <SignatureIframe
            apiFunction={createSignature}
            postData={postData}
            textRecommendation={t('SIGNATURE')}
            textInfo={t('SIGNATURE_INFO')}
            onSignaturitCompleted={onSuccess}
            onCreateSignature={onCreateSignatureHandler}></SignatureIframe>
        </Grid>
      </Grid>
    </>
  )
}
