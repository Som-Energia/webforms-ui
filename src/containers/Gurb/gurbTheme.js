export const PREV_COLOR = '#96b633'
export const NEXT_COLOR = '#E6E6E6'

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

export const textHeader5 = {
  fontFamily: 'Inter',
  color: '#919191',
  fontSize: '14px'
}

export const textHeader6 = {
  fontFamily: 'Inter',
  color: '#000000',
  fontSize: '16px',
  fontWeight: '700'
}

export const textBody1 = {
  fontFamily: 'Outfit',
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

export const textBody4 = {
  fontFamily: 'Inter',
  color: '#1E1E1E',
  fontWeight: '400',
  fontSize: '14px'
}

export const textSubtitle = {
  fontFamily: 'Inter',
  color: '#B3B3B3',
  fontSize: '16px',
  fontWeight: '400',
  textTransform: 'uppercase'
}

export const textField = {
  '& .MuiFormHelperText-root': { color: '#B3B3B3' },
  '& .MuiInputLabel-root': { color: '#B3B3B3' },
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

export const textReviewLabel = {
  display: 'flex',
  fontFamily: 'Inter',
  color: '#7E7E7E',
  alignItems: 'center',
  fontSize: '15px',
  fontWeight: '400'
}

export const textReviewValue = {
  display: 'flex',
  fontFamily: 'Inter',
  color: '#363636',
  alignItems: 'center',
  fontSize: '15px',
  fontWeight: '400'
}

export const textReviewSubtitle = {
  display: 'flex',
  fontFamily: 'Inter',
  color: '#7E7E7E',
  alignItems: 'center',
  fontSize: '15px',
  fontWeight: '600'
}

export const containerSpacing = {
  display: 'flex',
  padding: '16px',
  borderRadius: '8px'
}

export const iconOffRequirements = {
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
  textTransform: 'none',
  borderRadius: '2rem',
  border: '1px solid transparent',
  backgroundColor: '#C5F47C',
  color: 'primary.main',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#B6E471',
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
  border: '1px solid #D9D9D9',
  borderRadius: '2rem',
  color: '#1E1E1E',
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
    backgroundColor: '#C5F47C',
    border: '1px solid transparent',
    boxShadow: 'none',
    '& .MuiButton-startIcon': {
      '& svg': { width: '0.8rem', hight: '0.8rem' }
    }
  },
  width: '100%'
}

export const link = {
  ...textBody2
}

export const textCheckbox = {
  '& .MuiTypography-root': {
    fontFamily: 'Inter',
    color: '#000000',
    fontSize: '16px',
    fontWeight: '600'
  }
}

export const dialogWarningRounded = {
  fontSize: 44,
  color: 'warning.light',
  mt: 4
}

export const dialogCancelIcon = {
  fontSize: 40,
  color: 'error.light'
}

export const dialogTitle = {
  textAlign: 'center',
  fontSize: 18,
  fontWeight: 'bold',
  mb: -2
}

export const dialogIconButton = {
  position: 'absolute',
  right: 18,
  top: 18,
  color: 'black'
}

export const dialogContentStack = {
  spacing: 2,
  alignItems: 'center',
  textAlign: 'center'
}

export const dialogText = (severity) => ({
  fontSize: 14,
  a: {
    color: 'black',
    fontWeight: severity === 'warning' ? 'bold' : 'normal',
    textDecoration: 'underline'
  }
})

export const somStepperBox = {
  marginBottom: {
    xs: '30px',
    sm: '40px'
  }
}

export const alertParticipation = {
  mt: 4,
  mb: 4,
  color: '#ed6c02',
  backgroundColor: 'rgb(255, 244, 229)',
  '& .MuiAlert-icon': {
    color: '#ed6c02',
    mt: '0.3em'
  }
}

export const alertParticipationTypography = {
  color: '#ed6c02',
  '& a, & a:link, & a:visited, & a:active': {
    color: '#ed6c02 !important',
    textDecoration: 'underline'
  }
}

export const participationTypography = {
  '& a, & a:link, & a:visited, & a:active': {
    fontFamily: 'Inter',
    color: '#919191 !important',
    fontSize: '14px'
  }
}

export const participationAlertBox = {
  textAlign: 'left',
  padding: '0 20px'
}
