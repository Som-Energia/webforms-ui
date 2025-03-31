import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export default function WebFormsTheme() {
  const theme = createTheme({
    webFormStyles:{
       textHeader1:{
        fontFamily: 'Inter',
        color: '#00f',
        fontSize: '30px',
        fontWeight: '700'
       },
       textSubtitle:{
            fontFamily: 'Inter',
            color: '#f00',
            fontSize: '16px',
            fontWeight: '400',
            textTransform: 'uppercase'
       },
    },
  })
  return responsiveFontSizes(theme)
}
