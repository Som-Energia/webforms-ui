
export const chooserStyles = {
  paddingTop: '1.5rem',
  paddingBottom: '2rem',
  paddingLeft: '1.625rem',
  paddingRight: '1.625rem',
  borderRadius: '8px',
  border: '1px solid secondary.light',
  cursor: 'pointer'
}

export const chooserSelectedStyles = {
  ...chooserStyles,
  backgroundColor: 'secondary.extraLight'
}

export const iconRequirements = ({ padding = '8px' }) => ({
  borderRadius: '8px',
  border: '1px solid secondary.light',
  color: 'primary.dark',
  fontSize: '3rem',
  padding: padding,
  backgroundColor: 'secondary.white'
})

export const iconOffRequirements = ({ padding = '8px' }) => ({
  borderRadius: '8px',
  border: '1px solid secondary.light',
  color: 'primary.dark',
  fontSize: '3rem',
  padding: padding,
  backgroundColor: 'secondary.white',
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