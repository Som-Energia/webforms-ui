import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Grid from '@mui/material/Grid'

import MuiPhoneNumber from 'mui-phone-number'

import InputTitle from '../containers/Gurb/components/InputTitle'

export const HelperText = ({
  helperText,
  iconHelper,
  justifyContent = false
}) => {
  return (
    <Box display="flex" justifyContent={justifyContent}>
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
        <InputTitle text={textFieldName} required={required} />
      </Grid>
      <Grid item xs={12}>
        <Typography>{textFieldNameHelper}</Typography>
      </Grid>
      <Grid item xs={12}>
        <MuiPhoneNumber
          variant="outlined"
          defaultCountry="es"
          disableAreaCodes={true}
          name={name}
          data-cy={name}
          disabled={readonlyField}
          fullWidth
          InputProps={{
            onBlur: handleBlur
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
