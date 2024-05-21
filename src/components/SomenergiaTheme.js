import { createTheme, responsiveFontSizes } from '@mui/material'

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
        primary: '#4d4d4d'
      },
      primary: {
        //main: '#96D600', //'hsl(78, 100%, 42%)', // from style guide
        main: '#96b633', // from webforms-ui
        contrastText: 'white'
      },
      secondary: {
        //main: '#E0E723', //'hsl(62, 80%, 52%)', // from style guide
        main: '#a1a1a1', // from webforms-ui
        // main: '#e6cc00', // Original design
        //main: '#e2e2e2' // From mentxu design 2023-10-26
        dark: 'rgba(0, 0, 0, 0.54)',
        light: '#f2f2f2'
      },
      dark: {
        main: '#750d0d'
      },
      lightFont: {
        main: '#fff'
      },
      background: {
        default: 'transparent',
        paper: '#ffffff'
      },
      pagetitle: {
        main: '#4d4d4d'
      }
    },
    typography: {
      pagetitle: {
        fontSize: 20,
        fontWeight: 400, // from style guide
        lineHeight: 1
      },
      pagesubtitle: {
        fontSize: 15,
        fontWeight: 400,
        lineHeight: 1
      }
    },
    shape: {
      borderRadius: '0'
    },
    zIndex: {
      modal: 1600
    }
  })
  return responsiveFontSizes(theme, {
    variants: standardTypographies.concat(customTypographies)
  })
}
