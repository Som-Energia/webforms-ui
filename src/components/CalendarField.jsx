import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import 'dayjs/locale/es'
import 'dayjs/locale/ca'
import 'dayjs/locale/eu'
import 'dayjs/locale/gl'

import InputTitle from './InputTitle'

const CalendarField = ({
  textFieldName,
  handleChange,
  value,
  required = false
}) => {
  const { i18n } = useTranslation()

  const language = i18n.language

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <InputTitle text={textFieldName} required={required} />
      </Grid>
      <Grid item xs={12}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={language}>
          <DatePicker
            value={value}
            onChange={handleChange}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  )
}
export default CalendarField
