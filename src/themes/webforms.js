import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const BUTTON_BG = '#ffcdb5'
export const SECONDARY_LIGHT = 'D9D9D9'

export default function WebFormsTheme() {
  const theme = createTheme({
    palette: {
      //contrastThreshold: 2, // From webforms-ui
      contrastThreshold: 4.5, // Recommended by WCAG 2.1 Rule 1.4.3
      primary: {
        main: '#0B2E34',
        light: '#0c4c27',
        extraLight: '#CDFF80',
        dark: '#1E1E1E'
      },
      primary2: {
        main: '#ff632b',
        light: BUTTON_BG,
        alt: '#afb5e8'
      },
      secondary: {
        main: '#C4C4C4',
        dark: '#8C8C8C',
        light: SECONDARY_LIGHT,
        extraDark: '#636363',
        extraLight: '#FAFAFA',
        white: '#FFFFFF'
      },
      background: {
        first: '#CED5D0',
        second: '#E2E8DE',
        third: '#F0F3EC',
        button: '#C5F47C',
        hoverButton: '#B6E471',
        alertBox: '#ffcdb580' // 50% opacidad primary2.main
      },
      error: {
        main: '#D33C3C'
      },
      link: {
        main: '#0c4c27'
      }
    },
    typography: {
      display1: {
        fontSize: '96px',
        fontWeight: '400',
        letterSpacing: 0
      },
      display2: {
        fontSize: '64px',
        fontWeight: '400',
        letterSpacing: 0
      },
      headline1: {
        fontSize: '46px',
        fontWeight: '400',
        letterSpacing: 0
      },
      headline3: {
        fontSize: '28px',
        fontWeight: '400',
        letterSpacing: 0
      },
      'headline4.regular': {
        fontSize: '21px',
        fontWeight: '400',
        letterSpacing: '-0.84px',
      },
      'headline4.bold': {
        fontSize: '21px',
        fontWeight: '700',
        letterSpacing: 0
      },
      'body.md.regular': {
        fontSize: '16px',
        fontWeight: '400',
        letterSpacing: 0
      },
      'body.md.medium': {
        fontSize: '16px',
        fontWeight: '550',
        letterSpacing: 0
      },
      'input.label': {
        fontSize: '16px',
        fontWeight: '500',
        letterSpacing: 0
      },
      'body.md.bold': {
        fontSize: '16px',
        fontWeight: '700',
        letterSpacing: 0
      },
      'body.sm.regular': {
        fontSize: '14px',
        fontWeight: '400',
        letterSpacing: 0
      },
      'body.sm.bold': {
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: 0
      },
      'body.xs.regular': {
        fontSize: '14px',
        fontWeight: '400',
        letterSpacing: 0
      },
      'body.xs.bold': {
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: 0
      },
      error: {
        fontSize: '14px',
        fontWeight: '400',
        letterSpacing: 0
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
            'input.label': 'span',
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
      },
    },

  })
  return responsiveFontSizes(theme)
}