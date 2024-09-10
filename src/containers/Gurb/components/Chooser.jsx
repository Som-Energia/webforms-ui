import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { textHeader4, textBody1 } from '../gurbTheme'

const Option = () => {
  return (
    <Box
      sx={{
        maxWidth: '20rem',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #D9D9D9'
      }}>
      <LightbulbOutlinedIcon
        sx={{
          marginBottom: '1rem',
          borderRadius: '8px',
          border: '1px solid #D9D9D9',
          color: '#1E1E1E',
          fontSize: '3rem',
          padding: '8px'
        }}
      />
      <Typography sx={textHeader4}>Sí hi ha llum</Typography>
      <Typography sx={{ textBody1 }}>
        Tinc llum amb Som Energia o amb una altre comercialitzadora.
      </Typography>
    </Box>
  )
}

const Chooser = (props) => {
  const { options } = props

  return <Option />
}
export default Chooser
