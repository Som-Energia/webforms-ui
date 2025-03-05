import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { textHeader4, textBody1 } from '../gurbTheme'
import Grid from '@mui/material/Grid'

const ResultRequirement = ({
  containerColors,
  icon,
  textHeader,
  textBody,
  textHelper = false
}) => {
  return (
    <Grid container spacing={2} align={'center'}>
      <Grid item xs={12}>
        <Grid
          align={'center'}
          container
          rowSpacing={1}
          sx={{
            ...containerColors,
            padding: '2rem',
            paddingBottom: '3rem',
            borderRadius: '8px'
          }}>
          <Grid item xs={12}>
            {icon}
          </Grid>
          <Grid item xs={12}>
            <Typography sx={textHeader4}>{textHeader}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={textBody1}>{textBody}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {textHelper && (
          <Typography
            sx={{
              fontSize: '14px',
              color: '#000000'
            }}>
            {textHelper}
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default ResultRequirement
