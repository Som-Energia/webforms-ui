import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'

import { textHeader3, textBody2, containerSpacing } from '../gurbTheme'

const ProgressWarning = () => {
  const { t } = useTranslation()
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    // ask percentage to API / ERP
    setPercentage(10)
  }, []) // only when render, ensure this!

  return (
    <Box
      sx={{
        ...containerSpacing,
        ...{
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#DCEAFB'
        }
      }}>
      <Stack>
        <Gauge
          width={100}
          height={100}
          value={percentage}
          text={`${percentage}%`}
          cornerRadius="50%"
          sx={() => ({
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#2643CE'
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: '#C3D9FD'
            }
          })}
        />
      </Stack>
      <Box mx={2}>
        <Typography
          // variant="h3"
          sx={textHeader3}>
          {t('PROGRESS_WARNING_TITLE')}
        </Typography>
        <Typography
          // variant="body2"
          sx={textBody2}>
          {t('PROGRESS_WARNING_TEXT')}
        </Typography>
      </Box>
    </Box>
  )
}
export default ProgressWarning
