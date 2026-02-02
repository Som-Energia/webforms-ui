import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import Grid from '@mui/material/Grid'

import Chooser from '../../../../components/Chooser/Chooser'
import TextRecommendation from '../../components/TextRecommendation/TextRecommendation'
import SimpleGurbDialog from '../../components/SimpleGurbDialog/SimpleGurbDialog'

import PopUpContext from '../../../../context/PopUpContext'

import { iconRequirementsStyles, iconOffRequirementsStyles } from '../../../../themes/commonStyles'


const LightQuestion = (props) => {
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
      icon: <LightbulbOutlinedIcon sx={iconRequirementsStyles} />,
      textHeader: t('LIGHT_YES')
    },
    {
      id: 'light-off',
      icon: <LightbulbOutlinedIcon sx={iconOffRequirementsStyles} />,
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
