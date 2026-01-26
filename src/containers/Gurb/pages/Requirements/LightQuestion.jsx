import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@mui/material/styles'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'

import Chooser from '../../../../components/Chooser/Chooser'
import TextRecommendation from '../../components/TextRecommendation/TextRecommendation'

import { iconRequirements, iconOffRequirements } from '../../../../themes/commonStyles'

import Grid from '@mui/material/Grid'

import PopUpContext from '../../../../context/PopUpContext'
import SimpleGurbDialog from '../../components/SimpleGurbDialog/SimpleGurbDialog'

const LightQuestion = (props) => {
  const theme = useTheme()
  const { values, setFieldValue } = props
  const { t } = useTranslation()
  const { setContent } = useContext(PopUpContext)

  const handleLightQuestion = (value) => {
    setFieldValue('has_light', value)

    if (value === 'light-off') {
      setContent(
        <SimpleGurbDialog
          severity="warning"
          setContent={setContent}
          text1={t('GURB_LIGHT_QUESTION_ERROR_MAIN_TEXT')}
          text2={t('GURB_LIGHT_QUESTION_ERROR_SECONDARY_TEXT')}
        />
      )
    }
  }

  const options = [
    {
      id: 'light-on',
      icon: <LightbulbOutlinedIcon sx={iconRequirements({theme: theme})} />,
      textHeader: t('LIGHT_YES')
    },
    {
      id: 'light-off',
      icon: <LightbulbOutlinedIcon sx={iconOffRequirements({theme: theme})} />,
      textHeader: t('LIGHT_NO')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextRecommendation title={t('GURB_HAS_LIGHT_TITLE')} isHeader />
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
