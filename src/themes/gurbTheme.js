export const PREV_COLOR = 'background.button'
export const NEXT_COLOR = 'secondary.light'


export const textHeader4 = {  //TODO: Remove it after rebasing with ...
  fontFamily: 'Outfit',
  color: 'primary.dark',
  fontSize: '16px',
  fontWeight: '500'
}

export const textBody1 = {  //TODO: Remove it after rebasing with ...
  fontFamily: 'Outfit',
  color: 'secondary.dark',
  fontSize: '16px'
}

export const autocompleteAddressInput = {
  '& .MuiFormHelperText-root': { color: 'secondary.main' },
  '& .MuiInputLabel-root': { color: 'secondary.main' },
  '& .MuiOutlinedInput-root': { borderRadius: '8px', paddingY: '0px' }
}

export const iconOffRequirements = {
  borderRadius: '8px',
  border: '1px solid secondary.light',
  color: 'primary.dark',
  fontSize: '3rem',
  padding: '8px',
  backgroundColor: 'secondary.white',
  background:
    'linear-gradient(to top left, rgba(0,0,0,0) 0%, rgba(0,0,0,0) calc(50% - 1.5px), rgba(0,0,0,1) calc(50% - 1.4px), rgba(0,0,0,1) 50%, rgba(0,0,0,1) calc(50% + 1.4px), rgba(0,0,0,0) calc(50% + 1.5px), rgba(0,0,0,0) 100%)',
  backgroundRepeat: 'no-repeat',
  backgroundOrigin: 'content-box'
}

export const buttonGurbDark = {
  ...textBody1,
  textTransform: 'none',
  borderRadius: '2rem',
  border: '1px solid transparent',
  backgroundColor: 'background.button',
  color: 'primary.main',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'background.hoverButton',
    color: 'primary.main',
    boxShadow: 'none',
    border: '1px solid transparent'
  },
  '&::first-letter': {
    textTransform: 'uppercase'
  },
  width: '100%'
}

export const buttonGurbLight = {
  ...textBody1,
  textTransform: 'capitalize',
  border: '1px solid secondary.light',
  borderRadius: '2rem',
  color: 'primary.dark',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  boxShadow: 'none',
  '& .MuiButton-startIcon': {
    color: 'primary.main',
    '& svg': { width: '0.8rem', hight: '0.8rem' }
  },
  '&.Mui-disabled': {
    '& .MuiButton-startIcon': {
      color: 'lightgrey'
    }
  },
  '&:hover': {
    backgroundColor: 'background.button',
    border: '1px solid transparent',
    boxShadow: 'none',
    '& .MuiButton-startIcon': {
      '& svg': { width: '0.8rem', hight: '0.8rem' }
    }
  },
  width: '100%'
}

export const link = {  //TODO: Remove it after rebasing with ...
  fontFamily: 'Inter',
  color: '#000000',
  fontSize: '14px'
}

export const forceAlignLeft = {
  '& .MuiAlert-root': {
    justifyContent: 'flex-start !important',
    textAlign: 'left !important'
  }
}
