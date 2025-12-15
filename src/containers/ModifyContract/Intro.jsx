import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import NextButton from '../../components/Buttons/NextButton'

export default function ModifyIntro({ nextStep, prevStep }) {
  const { t } = useTranslation()
  const [isSubmitting, setSubmitting] = useState(false)

  const onFormSubmit = (event) => {
    event.preventDefault()
    if (!isSubmitting) {
      setSubmitting(true)
      nextStep()
    }
  }

  return (
    <Paper sx={{ mt: 2, padding: 2 }} elevation={0}>
      <Box mx={1}>
        <form onSubmit={onFormSubmit}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: t('MODIFY_POTTAR_INTRO', {
                url: t('MODIFY_POTTAR_INTRO_URL'),
                costs_url: t('MODIFY_POTTAR_INTRO_COSTS_URL'),
                potinfo_url: t('MODIFY_POTTAR_INTRO_POTINFO_URL')
              })
            }}
          />
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {nextStep && (
               <NextButton
                onClick={nextStep}
                disabled={isSubmitting}
                title={t('NEXT')}
                sx={{
                  backgroundColor: 'primary.extraLight',
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.extraLight',
                    backgroundColor: 'primary.main'
                  }
                }}
              />
            )}
          </Box>
        </form>
      </Box>
    </Paper>
  )
}
