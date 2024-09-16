import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { textHeader4, textBody1 } from '../gurbTheme'

const Option = ({ icon, textHeader, textBody }) => {
  return (
    <Box
      sx={{
        maxWidth: '20rem',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #D9D9D9'
      }}>
      {icon}
      <Typography sx={textHeader4}>{textHeader}</Typography>
      <Typography sx={textBody1}>{textBody}</Typography>
    </Box>
  )
}

const Chooser = ({ icon, textHeader, textBody }) => {
  return <Option icon={icon} textHeader={textHeader} textBody={textBody} />
}
export default Chooser
