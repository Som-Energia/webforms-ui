import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
// import AccountCircle from '@mui/icons-material/AccountCircle'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

import MuiPhoneNumber from 'mui-phone-number'

import { textHeader4, textHeader5, textHelper1, textField } from '../containers/Gurb/gurbTheme'
import InputTitle from '../containers/Gurb/components/InputTitle'

export const HelperText = ({
  helperText,
  iconHelper,
  justifyContent = false
}) => {
  return (
    <Box display="flex" justifyContent={justifyContent} sx={textHelper1}>
      {iconHelper && (
        <InfoOutlinedIcon sx={{ fontSize: '14px', margin: '2px' }} />
      )}
      {helperText}
    </Box>
  )
}

const PhoneField = ({
  textFieldLabel,
  textFieldName,
  textFieldNameHelper,
  textFieldHelper,
  iconHelper = false,
  handleChange,
  handleBlur,
  touched,
  value,
  error,
  readonlyField = false,
  required = false,
  name = false

}) => {
  const { t } = useTranslation()

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <InputTitle
          text={textFieldName}
          textStyle={textHeader4}
          required={required}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography sx={textHeader5}>{textFieldNameHelper}</Typography>
      </Grid>
      <Grid item xs={12}>
        <MuiPhoneNumber
          variant='outlined'
          sx={textField}
          defaultCountry={'es'}
          disableAreaCodes='True'
          preferredCountries={['es']}
          name={name}
          data-cy={name}
          disabled={readonlyField}
          fullWidth
          InputProps={{
            onBlur: handleBlur,
            startAdornment: (
                <HighlightOffIcon />
              // <InputAdornment position="start">
              //   {/* <AccountCircle /> */}
              // </InputAdornment>
            ),
          }}
          label={value ? undefined : textFieldLabel}
          helperText={
            touched && error ? (
              t(error)
            ) : (
              <HelperText
                helperText={textFieldHelper}
                iconHelper={iconHelper}
              />
            )
          }
          onChange={handleChange}
          value={value}
          error={touched && error !== undefined}
        />
      </Grid>
    </Grid>
  )
}
export default PhoneField
