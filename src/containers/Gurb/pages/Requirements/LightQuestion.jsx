import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'

import Chooser from '../../components/Chooser'
import TextRecomendation from '../../components/TextRecomendation'

import { iconRequirements, iconOffRequirements } from '../../gurbTheme'

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
        main_text: t('GURB_LIGHT_QUESTION_ERROR_MAIN_TEXT'),
        seconday_text: t('GURB_LIGHT_QUESTION_ERROR_SECONDARY_TEXT'),
        link_text: t('GURB_LIGHT_QUESTION_ERROR_LINK_TEXT'),
        error_type: 'alert',
        clean_field: () => {
          setFieldValue('has_light', undefined)
        }
      })
    }
  }

  const options = [
    {
      id: 'light-on',
      icon: <LightbulbOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_HAS_LIGHT_HEADER'),
      textBody: t('GURB_HAS_LIGHT_BODY')
    },
    {
      id: 'light-off',
      icon: <LightbulbOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_HAS_NO_LIGHT_HEADER'),
      textBody: t('GURB_HAS_NO_LIGHT_BODY')
    }
  ]

  return (
    <>
      <TextRecomendation title={t('GURB_HAS_LIGHT_TITLE')} />
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
