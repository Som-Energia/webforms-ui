import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'

import Chooser from '../../../../components/NewChooser'
import TextRecomendation from '../../components/TextRecomendation'

import { iconRequirements } from '../../../../themes/commonStyles'
import { iconOffRequirements } from '../../gurbTheme'

import GurbErrorContext from '../../../../context/GurbErrorContext'
import Grid from '@mui/material/Grid'

import PopUpContext from '../../../../context/PopUpContext'
import { buildGurbDialog } from '../../../../containers/Gurb/utils/buildGurbDialog'

const LightQuestion = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  const { setContent } = useContext(PopUpContext)

  const handleLightQuestion = (value) => {
    setFieldValue('has_light', value)

    if (value === 'light-off') {
      setError(true)
      setContent(
        buildGurbDialog({
          severity: 'warning',
          setContent: setContent,
          text1Key: t('GURB_LIGHT_QUESTION_ERROR_MAIN_TEXT'),
          text2Key: t('GURB_LIGHT_QUESTION_ERROR_SECONDARY_TEXT')
        })
      )
    } else {
      setError(false)
    }
  }

  const options = [
    {
      id: 'light-on',
      icon: <LightbulbOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_HAS_LIGHT_HEADER')
    },
    {
      id: 'light-off',
      icon: <LightbulbOutlinedIcon sx={iconOffRequirements} />,
      textHeader: t('GURB_HAS_NO_LIGHT_HEADER')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextRecomendation title={t('GURB_HAS_LIGHT_TITLE')} />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="light-question"
          options={options}
          value={values.has_light}
          handleChange={handleLightQuestion}
        />
      </Grid>
    </Grid>
  )
}
export default LightQuestion
