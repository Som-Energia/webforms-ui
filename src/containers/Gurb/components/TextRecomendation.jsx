import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { textHeader2, textBody1 } from '../gurbTheme'

const TextRecomendation = ({ title, text }) => {
  return (
    <Box>
      <Typography
        // variant="h2"
        sx={textHeader2}>
        {title}
      </Typography>
      <Typography
        // variant="body1"
        sx={textBody1}>
        {text}
      </Typography>
    </Box>
  )
}
export default TextRecomendation
