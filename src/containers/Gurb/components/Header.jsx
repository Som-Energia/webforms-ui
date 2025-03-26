import Typography from '@mui/material/Typography'

import { textHeader1 } from '../gurbTheme'

const Header = ({ title }) => {
  const theme = useTheme()

  return (
    <Typography
      // variant="h2"
      sx={textHeader1}>
      {title}
    </Typography>
  )
}

export default Header
