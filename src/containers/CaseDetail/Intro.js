import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

export default function ModifyIntro({ nextStep, prevStep, handleStepChanges }) {
  const { t } = useTranslation()

  const onNextStep = (event) => {
    event.preventDefault()
    nextStep()
  }

  const onPrevStep = (event) => {
    event.preventDefault()
    prevStep()
  }

  return (
    <Paper sx={{ mt: 2, p: 2 }} elevation={0}>
      <Box mx={1}>
        <Typography
          variant="body1"
          component="div"
          dangerouslySetInnerHTML={{
            __html: t('MODIFY_POTTAR_INTRO', {
              url: t('MODIFY_POTTAR_INTRO_URL'),
              url_costs: t('MODIFY_POTTAR_INTRO_COSTS_URL'),
              potinfo_url: t('MODIFY_POTTAR_INTRO_POTINFO_URL')
            })
          }}
        />
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          {prevStep && (
            <Button
              sx={{ mt: 1, mr: 1 }}
              startIcon={<ArrowBackIosIcon />}
              onClick={(event) => onPrevStep(event)}>
              {t('PAS_ANTERIOR')}
            </Button>
          )}
          {nextStep && (
            <Button
              type="submit"
              sx={{ mt: 1, mr: 1 }}
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
              onClick={(event) => onNextStep(event)}>
              {t('SEGUENT_PAS')}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  )
}
