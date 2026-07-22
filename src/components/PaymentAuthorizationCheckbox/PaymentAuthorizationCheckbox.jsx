import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

const PaymentAuthorizationCheckbox = ({
  checked,
  label,
  dataCy,
  onClick,
  onChange
}) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <FormControlLabel
        control={
          <Checkbox
            data-cy={dataCy}
            checked={checked}
            onClick={onClick}
            onChange={onChange}
          />
        }
        label={
          <>
            <Typography variant="body.sm.regular" color="primary.dark">
              {label}
            </Typography>
            <Typography variant="body.sm.bold" color="error">
              {'*'}
            </Typography>
          </>
        }
      />
    </Box>
  )
}

export default PaymentAuthorizationCheckbox
