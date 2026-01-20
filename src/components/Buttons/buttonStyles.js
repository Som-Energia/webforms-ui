export const textBody1 = {
  fontFamily: 'Outfit',
  color: 'secondary.dark',
  fontSize: '16px'
}

export const buttonDark = {
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

export const buttonLight = {
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
