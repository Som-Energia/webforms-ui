import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import { textCheckbox } from '../../gurbTheme'

const SomCheckbox = ({ textBody, valueAccepted, textHelperAction }) => {
  return (
    <FormControlLabel
      sx={{ ...textCheckbox, marginTop: '2rem' }}
      control={
        <Checkbox
          color="primary"
          onClick={handleClick}
          checked={valueAccepted}
        />
      }
      label={
        <label
          dangerouslySetInnerHTML={{
            __html: { textBody }
          }}
        />
      }
    />
  )
}

export default SomCheckbox
