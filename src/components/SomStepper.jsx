import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

const SomStepper = (props) => {
  const { activeStep, steps, showNames = true } = props
  const { t } = useTranslation()

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: '2rem',
        marginBottom: '3rem'
      }}>
      {Object.entries(steps).map(([stepName, stepNumber], index) => {
        return (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            <Box
              sx={{
                width: `100%`,
                height: '6px',
                backgroundColor:
                  activeStep >= index ? 'primary.main' : 'secondary.light',
                borderRadius: '12px'
              }}
            />
            {showNames && (
              <Box
                sx={{
                  marginTop: '6px'
                }}>
                <Typography
                  key={index}
                  color={
                    activeStep >= index ? 'primary.main' : 'secondary.light'
                  }>
                  {t(stepName)}
                </Typography>
              </Box>
            )}
          </Box>
        )
      })}
    </Stack>
  )
}
export default SomStepper
