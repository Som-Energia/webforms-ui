import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export default function WebFormsTheme() {
  const theme = createTheme({
    palette: {
      //contrastThreshold: 2, // From webforms-ui
      contrastThreshold: 4.5, // Recommended by WCAG 2.1 Rule 1.4.3
      primary: {
        main: '#0B2E34',
        light: '#0c4c27',
        extraLight: '#CDFF80'
      },
      primary2: {
        main: '#ff632b',
        light: '#ffcdb5',
        alt: '#afb5e8'
      },
      secondary: {
        main: '#8C8C8C',
        dark: '#8C8C8C',
        light: '#D9D9D9'
      },
      background: {
        first: '#CED5D0',
        second: '#E2E8DE',
        third: '#F0F3EC'
      },
      error: {
        main: '#EE4949'
      }
    },
    typography: {
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
      'headline4.regular': {
        ontSize: '21px',
        fontWeight: '400'
      },
      'headline4.bold': {
        fontSize: '21px',
        fontWeight: '700'
      },
      'body.md.regular': {
        fontSize: '16px',
        fontWeight: '400'
      },
      'body.md.bold': {
        fontSize: '16px',
        fontWeight: '700'
      },
      'body.sm.regular': {
        fontSize: '14px',
        fontWeight: '400'
      },
      'body.sm.bold': {
        fontSize: '14px',
        fontWeight: '700'
      },
      'body.xs.regular': {
        fontSize: '12px',
        fontWeight: '400'
      },
      'body.xs.bold': {
        fontSize: '12px',
        fontWeight: '700'
      },
      error: {
        fontSize: '12px',
        fontWeight: '400'
      }
    },
    components: {
      MuiTypography: {
        defaultProps: {
          fontFamily: 'Outfit',
          color: '#0B2E34',
          variantMapping: {
            display1: 'h1',
            display2: 'h2',
            headline1: 'h1',
            headline2: 'h2',
            headline3: 'h3',
            'headline4.regular': 'h4',
            'headline4.bold': 'h4',
            'body.md.regular': 'span',
            'body.md.bold': 'span',
            'body.sm.regular': 'span',
            'body.sm.bold': 'span',
            'body.xs.regular': 'span',
            'body.xs.bold': 'span',
            error: 'span',
            'button.md': 'button',
            'button.sm': 'button'
          }
        }
      }
    }
  })
  return responsiveFontSizes(theme)
}
