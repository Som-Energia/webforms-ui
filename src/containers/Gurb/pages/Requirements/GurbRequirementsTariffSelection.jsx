import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../../../components/NewChooser'
import { CommunityIcon, HandshakeIcon } from '../../../../data/icons/Icons'

import { textBody1 } from '../../gurbTheme'

const GurbRequirementsTariffSelection = (props) => {
  const { i18n } = useTranslation()
  const { language, gurbCode } = useParams()
  const { t } = useTranslation()
  const { values, setFieldValue } = props
  const [selectedOption, setSelectedOption] = useState(null)

  const options = [
    {
      id: 'periods-tariff',
      icon: <HandshakeIcon />,
      textHeader: t(
        'GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_PERIODS_TARIFF'
      ),
      textBody: t(
        'GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_PERIODS_TARIFF_BODY'
      )
    },
    {
      id: 'indexed-tariff',
      icon: <CommunityIcon />,
      textHeader: t(
        'GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_INDEXED_TARIFF'
      ),
      textBody: t(
        'GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_INDEXED_TARIFF_BODY'
      )
    }
  ]

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const handleTariffQuestion = (optionId) => {
    setSelectedOption(optionId)

    const baseUrl = t('SOMENERGIA_BASE_URL')
    const redirectUrl =
      optionId === 'periods-tariff'
        ? baseUrl +
          t('GURB_REQUIREMENTS_RESULT_BUTTON_LINK_PERIODS_TARIFF', {
            gurbCode: gurbCode
          })
        : baseUrl +
          t('GURB_REQUIREMENTS_RESULT_BUTTON_LINK_INDEXED_TARIFF', {
            gurbCode: gurbCode
          })
    setFieldValue('redirectUrl', redirectUrl)
  }

  return (
    <Grid item>
      <TextRecomendation
        title={t('GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_TITLE')}
      />

      <Typography sx={textBody1}>
        {t(
          'GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_ACTION_CONTEXT_BODY'
        )}
      </Typography>

      <Typography sx={{ mt: 4, mb: 2 }}>
        {t('GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_ACTION_TITLE')}
      </Typography>

      <Chooser
        name="tariff-question"
        data-cy="tariff-chooser"
        options={options}
        value={selectedOption}
        handleChange={handleTariffQuestion}
        maxWidth="18rem"
      />

      <Typography
        sx={{ mt: 2 }}
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: t(
            'GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_TARIFF_LINK_TEXT',
            {
              tariffs_info_url: t(
                'GURB_REQUIREMENTS_FORM_FINISH_WITHOUT_CONTRACT_TARIFF_LINK_TEXT_URL'
              )
            }
          )
        }}
      />
    </Grid>
  )
}
export default GurbRequirementsTariffSelection
