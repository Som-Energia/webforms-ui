import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Grid from '@mui/material/Grid'
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

function handleOnChange(value) {
  this.setState({
     phone: value
  });
}

const PhoneField = ({
  textFieldLabel,
  textFieldName,
  textFieldNameHelper,
  textFieldHelper,
  iconHelper = false,
  handleChange,
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
          defaultCountry={'es'}
          sx={textField}
          name={name}
          data-cy={name}
          disabled={readonlyField}
          fullWidth
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
