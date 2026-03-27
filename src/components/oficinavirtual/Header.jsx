import Typography from '@mui/material/Typography'

const Header = ({ children }) => {

  return <Typography component='h3' sx={{
    width: '100%',
    backgroundColor: 'primary.main',
    color: '#fff',
    padding: '1rem 1.5rem',
    margin: '0 0 .5em 0',
    fontSize: '18px'
  }} >{children}</Typography>
}

export default Header
