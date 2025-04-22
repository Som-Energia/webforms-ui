import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// TODO: This list must be updated if standard MUI typographies change
const standardTypographies = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'button',
  'overline'
]

const customTypographies = ['pagetitle', 'pagesubtitle']

export default function SomEnergiaTheme() {
  const theme = createTheme({
    palette: {
      //contrastThreshold: 2, // From webforms-ui
      contrastThreshold: 4.5, // Recommended by WCAG 2.1 Rule 1.4.3
      tonalOffset: 0.2,
      text: {
        primary: '#1E1E1E'
      },
      primary: {
        //main: '#96D600', //'hsl(78, 100%, 42%)', // from style guide
        main: '#0B2E34', // from webforms-ui
        contrastText: 'white',
        light: '#0c4c27',
        extraLight: '#CDFF80',
        megaLight: "#F8F9F6",
        dark: '#1E1E1E'
      },
      secondary: {
        main: '#ff632b', // taronja
        dark: '#8C8C8C', // gris fosc
        extraDark:'#6f6262',
        alt: '#CDFF80',  // verd lima
        light: '#F0F3EC'  // Fondo

        //main: '#E0E723', //'hsl(62, 80%, 52%)', // from style guide
        // main: '#e6cc00', // Original design
        //main: '#e2e2e2' // From mentxu design 2023-10-26
      },
      dark: {
        main: 'red'
      },
      lightFont: {
        main: 'yellow'
      },
      background: {
        default: 'transparent',
        paper: '#ffffff'
      },
      pagetitle: {
        main: '#1E1E1E'
      },
      failure: {
        primary: '#fe6444'
      }
    },
    typography: {
      fontFamily: 'Outfit',
      pagetitle: {
        fontSize: 20,
        fontWeight: 500, // from style guide
        lineHeight: 1
      },
      pagesubtitle: {
        fontSize: 15,
        fontWeight: 400,
        lineHeight: 1
      }
    },
    components: {
      // MuiTypography: {
      //   defaultProps: {
      //     fontFamily: 'Outfit',
      //     color: '#0B2E34',
      //   }
      // },
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            textDecoration: 'none'
          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          standardSuccess: {
            backgroundColor: '#E2E8DE',
            color: '#0B2E34'
          },
          // standardError: {
          //   backgroundColor: '#EE4949',
          //   color: 'white'
          // },
          standardWarning: {
            backgroundColor: 'rgba(255, 205, 181, 0.5)',
            color: '#FF632B'
          },
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'capitalize', // Aquí cambias el texto
          },
        },
      },
    },
    gurbStyles: {
      textHeader1: {
        fontFamily: 'Inter',
        color: '#00f',
        fontSize: '30px',
        fontWeight: '700'
      }
    },
    shape: {
      borderRadius: 0
    },
    zIndex: {
      modal: 1600
    }
  })
  return responsiveFontSizes(theme, {
    variants: standardTypographies.concat(customTypographies)
  })
}
