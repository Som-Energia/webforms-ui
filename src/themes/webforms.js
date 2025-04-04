import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export default function WebFormsTheme() {
  const theme = createTheme({
    palette: {
      //contrastThreshold: 2, // From webforms-ui
      contrastThreshold: 4.5, // Recommended by WCAG 2.1 Rule 1.4.3
      primary: {
        main: '#0B2E34',
        light: '#0c4c27',
        extraLight: "#CDFF80"
      },
      primary2: {
        main: '#ff632b',
        light: '#ffcdb5',
        alt: '#afb5e8'
      },
      secondary: {
        main: '#8C8C8C',
        dark: '#8C8C8C',
        light: '#D9D9D9',
      },
      background: {
        first: '#CED5D0',
        second: '#E2E8DE',
        third: '#F0F3EC'
      },
    },
    typography: {
      fontFamily: 'Outfit',
    },
    webFormStyles: {
      display1: {
        fontSize: '96px',
        fontWeight: '400'
      },
      display2: {
        fontSize: '64px',
        fontWeight: '400'
      },
      headline1: {
        fontSize: '46px',
        fontWeight: '400'
      },
      headline3: {
        fontSize: '28px',
        fontWeight: '400'
      },
      headline4: {
        regular: {
          ontSize: '21px',
          fontWeight: '400'
        },
        bold: {
          ontSize: '21px',
          fontWeight: '700'
        }
      },
      body: {
        md: {
          regular: {
            ontSize: '16px',
            fontWeight: '400'
          },
          bold: {
            ontSize: '16px',
            fontWeight: '700'
          }
        },
        sm: {
          regular: {
            ontSize: '14px',
            fontWeight: '400'
          },
          bold: {
            ontSize: '14px',
            fontWeight: '700'
          }
        },
        xs: {
          regular: {
            ontSize: '12px',
            fontWeight: '400'
          },
          bold: {
            ontSize: '12px',
            fontWeight: '700'
          }
        }
      },
      button: {
        md: {
          ontSize: '14px',
          fontWeight: '400'
        },
        sm:{
          ontSize: '12px',
          fontWeight: '400'
        }
      }
    },
  })
  return responsiveFontSizes(theme)
}
