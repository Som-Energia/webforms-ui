export const textHeader1 = {
  fontFamily: 'Inter',
  color: '#3B3B3B',
  fontSize: '30px',
  fontWeight: '700'
}

export const textHeader2 = {
  fontFamily: 'Inter',
  color: '#1E1E1E',
  fontSize: '18px',
  fontWeight: '700'
}

export const textHeader3 = {
  fontFamily: 'Inter',
  color: '#000000',
  fontSize: '16px',
  textTransform: 'uppercase',
  fontWeight: '600'
}

export const textHeader4 = {
  fontFamily: 'Inter',
  color: '#1E1E1E',
  fontSize: '16px',
  fontWeight: '500'
}

export const textBody1 = {
  fontFamily: 'Inter',
  color: '#919191',
  fontSize: '16px'
}

export const textBody2 = {
  fontFamily: 'Inter',
  color: '#000000',
  fontSize: '14px'
}

export const textBody3 = {
  fontFamily: 'Inter',
  color: '#373737',
  fontWeight: '400',
  fontSize: '16px'
}

export const textSubtitle = {
  fontFamily: 'Inter',
  color: '#B3B3B3',
  fontSize: '16px',
  fontWeight: '400',
  textTransform: 'uppercase'
}

export const textSubtitle2 = {
  fontFamily: 'Inter',
  color: '#B3B3B3',
  fontSize: '12px',
  fontWeight: '400'
}

export const textHelper1 = {
  display: 'flex',
  color: '#B3B3B3',
  alignItems: 'center',
  fontSize: '14px'
}

export const containerSpacing = {
  display: 'flex',
  padding: '0.3rem',
  borderRadius: '8px'
}

export const iconRequirements = {
  marginBottom: '1rem',
  borderRadius: '8px',
  border: '1px solid #D9D9D9',
  color: '#1E1E1E',
  fontSize: '3rem',
  padding: '8px',
  backgroundColor: '#fff'
}

export const iconOffRequirements = {
  marginBottom: '1rem',
  borderRadius: '8px',
  border: '1px solid #D9D9D9',
  color: '#1E1E1E',
  fontSize: '3rem',
  padding: '8px',
  backgroundColor: '#fff',
  background:
    'linear-gradient(to top left, rgba(0,0,0,0) 0%, rgba(0,0,0,0) calc(50% - 1.5px), rgba(0,0,0,1) calc(50% - 1.4px), rgba(0,0,0,1) 50%, rgba(0,0,0,1) calc(50% + 1.4px), rgba(0,0,0,0) calc(50% + 1.5px), rgba(0,0,0,0) 100%)',
  backgroundRepeat: 'no-repeat',
  backgroundOrigin: 'content-box'
}

export const chooserGurb = {
  width: '20.45rem',
  paddingTop: '1.5rem',
  paddingBottom: '2rem',
  paddingLeft: '1.625rem',
  paddingRight: '1.625rem',
  borderRadius: '8px',
  border: '1px solid #D9D9D9',
  cursor: 'pointer'
}

export const chooserGurbSelected = {
  ...chooserGurb,
  backgroundColor: '#FAFAFA'
}

export const buttonGurbDark = {
  ...textBody1,
  textTransform: 'capitalize',
  borderRadius: '2rem',
  border: '1px solid transparent',
  backgroundColor: '#1E1E1E',
  color: '#FFFFFF',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#FFFFFF',
    color: '#1E1E1E',
    boxShadow: 'none',
    border: '1px solid #D9D9D9'
  }
}

export const buttonGurbLight = {
  ...textBody1,
  textTransform: 'capitalize',
  border: '1px solid #D9D9D9',
  borderRadius: '2rem',
  color: '#1E1E1E',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  boxShadow: 'none',
  '& .MuiButton-startIcon': {
    color: '#1E1E1E',
    '& svg': { width: '0.8rem', hight: '0.8rem' }
  },
  '&.Mui-disabled': {
    '& .MuiButton-startIcon': {
      color: 'lightgrey'
    }
  },
  '&:hover': {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    border: '1px solid transparent',
    boxShadow: 'none',
    '& .MuiButton-startIcon': {
      color: '#FFFFFF',
      '& svg': { width: '0.8rem', hight: '0.8rem' }
    }
  }
}

export const link = {
  ...textBody2
}
