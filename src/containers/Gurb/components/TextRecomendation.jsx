import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { textHeader2, textBody1 } from '../gurbTheme'
import RequiredTitle from './InputTitle'

const TextRecomendation = ({ title, text, required = false }) => {
  return (
    <Box>
      <RequiredTitle text={title} textStyle={textHeader2} required={required} />
      <Typography
        // variant="body1"
        sx={textBody1}>
        {text}
      </Typography>
    </Box>
  )
}
export default TextRecomendation
