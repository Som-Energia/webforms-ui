import Typography from '@mui/material/Typography'

import { textHeader1 } from '../gurbTheme'
import useTheme from '@mui/material/styles/useTheme'

const Header = ({ title }) => {
  const theme = useTheme()
console.log({theme})
  return (
    <Typography
      // variant="h2"
      sx={theme.gurbStyles.textHeader1}>
      {title}
    </Typography>
  )
}

export default Header
