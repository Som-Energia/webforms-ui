// AlertBox Custom Style

export const getAlertBoxStyles = (theme, severity) => {
  const primary = theme.palette?.primary2?.main

  if (severity === 'warning') {
    return {
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffcdb580', // 50% opacidad
      border: 'none',
      borderRadius: '8px',
      color: primary,
      '& .MuiAlertTitle-root': {
        color: primary
      },
      '& .MuiTypography-root': {
        color: primary,
        fontSize: 'body.md.regular'
      },
      '& *': {
        color: `${primary} !important`
      }
    }
  }

  return {}
}

export const chooser = {
  paddingTop: '1.5rem',
  paddingBottom: '2rem',
  paddingLeft: '1.625rem',
  paddingRight: '1.625rem',
  borderRadius: '8px',
  border: '1px solid #D9D9D9',
  cursor: 'pointer'
}

export const chooserSelected = {
  ...chooser,
  backgroundColor: '#FAFAFA'
}

export const iconRequirements = ({ padding = '8px' }) => ({
  borderRadius: '8px',
  border: '1px solid #D9D9D9',
  color: '#1E1E1E',
  fontSize: '3rem',
  padding: padding,
  backgroundColor: '#fff'
})

export const iconOffRequirements = ({ padding = '8px' }) => ({
  borderRadius: '8px',
  border: '1px solid #D9D9D9',
  color: '#1E1E1E',
  fontSize: '3rem',
  padding: padding,
  backgroundColor: '#fff',
  background:
    'linear-gradient(to top left, rgba(0,0,0,0) 0%, rgba(0,0,0,0) calc(50% - 1.5px), rgba(0,0,0,1) calc(50% - 1.4px), rgba(0,0,0,1) 50%, rgba(0,0,0,1) calc(50% + 1.4px), rgba(0,0,0,0) calc(50% + 1.5px), rgba(0,0,0,0) 100%)',
  backgroundRepeat: 'no-repeat',
  backgroundOrigin: 'content-box'
})

// RedirectUrl component
export const redirectUrlTitle = {
  textAlign: 'center'
}

export const redirectUrlDescription = {
  mt: 0,
  fontWeight: 400,
  fontSize: '1rem',
  lineHeight: 1.75,
  textAlign: 'center',
  color: 'secondary.extraDark'
}

export const redirectUrlButton = {
  boxSizing: 'border-box',
  lineHeight: 1,
  textTransform: 'none',
  p: 1.5
}