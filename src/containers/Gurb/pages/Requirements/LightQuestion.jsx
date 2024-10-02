import { useTranslation } from 'react-i18next'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'

import Chooser from '../../components/Chooser'
import TextRecomendation from '../../components/TextRecomendation'

import { iconRequirements, iconOffRequirements } from '../../gurbTheme'
import { useContext } from 'react'
import GurbErrorContext from '../../../../context/GurbErrorContext'

const LightQuestion = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()
  const { setError, setErrorInfo } = useContext(GurbErrorContext)

  const handleLightQuestion = (value) => {
    setFieldValue('has_light', value)
    if (value === 'light-off') {
      setError(true)
      setErrorInfo({
        main_text: 'Si no hi ha llum a casa teva...',
        seconday_text: "Et pots donar d'alta al servei...",
        link_text: 'Sí que tinc llum a casa',
        test: setFieldValue('has_light', undefined)
      })
    }
  }

  const options = [
    {
      id: 'light-on',
      icon: <LightbulbOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_HI_HA_LLUM'),
      textBody: t('GURB_HI_HA_LLUM_BODY')
    },
    {
      id: 'light-off',
      icon: <LightbulbOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_NO_HI_HA_LLUM'),
      textBody: t('GURB_NO_HI_HA_LLUM_BODY')
    }
  ]

  return (
    <>
      <TextRecomendation title={t('GURB_ACTUALMENT_HI_HA_LLUM')} />
      &nbsp;
      <Chooser
        options={options}
        value={values.has_light}
        handleChange={handleLightQuestion}
      />
    </>
  )
}
export default LightQuestion
