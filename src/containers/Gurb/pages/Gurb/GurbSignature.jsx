import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Grid2 as Grid } from '@mui/material'

import SignatureIframe from '../../../Signature'
import { createGurbSignature } from '../../../../services/apiGurb'
import { getUrlOrBrowserSessionLanguage } from '../../../../services/utils'

const GurbSignature = ({
  values,
  gurbCode,
  setRedsysData,
  onSuccess = () => {}
}) => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const { language } = useParams()
  const urlOrBrowserSessionLanguage = getUrlOrBrowserSessionLanguage(language, i18n.language)

  const createSignatureHandler = (response) => {
    if (!response) {
      return
    }

    setRedsysData(response.redsys_data)
  }

  return (
    <>
      <Grid container direction={'column'}>
        <Grid item size={12} sx={{ textAlign: 'center', width: '100%' }}>
          <SignatureIframe
            apiFunction={createGurbSignature}
            postData={{
              lang: `${i18n.language}_ES`,
              gurb_code: gurbCode,
              access_tariff: values?.tariff_name,
              beta: values?.gurb?.power,
              cups: values?.cups,
              vat: values?.owner?.nif,
              session_language: urlOrBrowserSessionLanguage
            }}
            textRecommendation={t('SIGNATURE')}
            textInfo={t('GURB_SIGNATURE_INFO')}
            errorDescription={t('GURB_SIGNATURE_ERROR_DESCRIPTION')}
            onCreateSignature={createSignatureHandler}
            onSignaturitCompleted={onSuccess}></SignatureIframe>
        </Grid>
      </Grid>
    </>
  )
}

export default GurbSignature
