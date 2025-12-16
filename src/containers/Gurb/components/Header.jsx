import Typography from '@mui/material/Typography'

import { textHeader1 } from '../../../themes/gurbTheme'

const Header = ({ title }) => {

  return (
    <Typography
      // variant="h2"
      sx={textHeader1}>
      {title}
    </Typography>
  )
}

export default Header
