import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { textHeader2, textBody1 } from '../../../themes/gurbTheme'
import RequiredTitle from '../../../components/InputTitle'

const TextRecomendation = ({ title, text, required, isHeader }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <RequiredTitle
          text={title}
          textStyle={textHeader2}
          required={required}
          isHeader={isHeader}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          // variant="body1"
          sx={textBody1}>
          {text}
        </Typography>
      </Grid>
    </Grid>
  )
}
export default TextRecomendation
