export const iconRequirementsStyles = ({ padding = '8px' }) => ({
  borderRadius: '8px',
  border: '1px solid',
  borderColor: 'secondary.light',
  color: 'primary.dark',
  fontSize: '3rem',
  padding: padding,
  backgroundColor: 'secondary.white'
})

export const iconOffRequirementsStyles = ({ padding = '8px' }) => ({
  borderRadius: '8px',
  border: '1px solid',
  borderColor: 'secondary.light',
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

export const autocompleteAddressInput = {
  '& .MuiFormHelperText-root': { color: 'secondary.main' },
  '& .MuiInputLabel-root': { color: 'secondary.main' },
  '& .MuiOutlinedInput-root': { borderRadius: '8px', paddingY: '0px' }
}