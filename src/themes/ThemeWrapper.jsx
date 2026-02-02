import { Suspense } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import Loading from '../components/Loading'


const ThemeWrapper = ({ children, theme: customTheme }) => {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </ThemeProvider>
  )
}

export default ThemeWrapper