import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import 'dayjs/locale/es'
import 'dayjs/locale/ca'
import 'dayjs/locale/eu'
import 'dayjs/locale/gl'

import InputTitle from '../containers/Gurb/components/InputTitle'
import { textHeader4, textHeader5 } from '../containers/Gurb/gurbTheme'

const CalendarField = ({
  textFieldName,
  textFieldNameHelper,
  handleChange,
  value,
  required = false
}) => {
  const { i18n } = useTranslation()

  const language = i18n.language

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
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
          <DatePicker
            value={value}
            onChange={handleChange}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  )
}
export default CalendarField
