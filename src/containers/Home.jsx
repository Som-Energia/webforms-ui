import React from 'react'
import { useNavigate } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import i18n from '../i18n/i18n'


let language = navigator.language
const availableLanguages = Object.keys(i18n?.options?.resources)
if (!availableLanguages.includes(language)) {
  language = 'ca'
}
let gurbId = 2  // TODO: move to env?

const options = [
  { title: 'New Contract - Form', href: `${language}/new-contract-form`},
  { title: 'Acceptació/Rebuig D1', href: '/d1-detail' },
  { title: 'Component Testing', href: `/${language}/component-testing` },
  { title: 'Alta persona socia', href: '/new-member' },
  { title: 'Aportació al capital social', href: '/contribution' },
  { title: 'Baixa punt de suministrament', href: '/cancellation' },
  { title: 'Confirmament de baixa', href: '/cancellation/confirm' },
  { title: 'Canvi de titular', href: '/holder-change' },
  { title: 'Contractació', href: '/contract' },
  { title: 'Contractació 20', href: `${language}/contract-20` },
  { title: 'Contractació 30', href: '/contract-30' },
  { title: 'Modificació contractual', href: '/modify-contract' },
  { title: 'Modificació Tarifa Indexada', href: '/contract/indexed' },
  { title: 'Generation kwh', href: '/investments/investments-kwh' },
  { title: 'Generation kwh - Form', href: '/generationkwh/contribution' },
  { title: 'Gurb - Form', href: `${language}/gurb/${gurbId}/validations/`}

]

const Home = (props) => {
  const { version } = props
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f2f2f2' }}>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography variant="h6">
            webforms-ui
            <Typography
              sx={{
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                pl: '10px'
              }}
              component="body1">
            </Typography>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ flexGrow: 1, padding: 12 }}>
        <Box sx={{ fontSize: '0.85rem', fontWeight: '500' }}>
          Last commit hash: {version}
        </Box>
        {options.map((option) => (
          <Paper
            key={option.href}
            sx={{
              padding: 3,
              mt: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              '& h6': {
                fontSize: '1rem'
              }
            }}
            onClick={() => {
              navigate(option.href)
            }}>
            <Typography variant="h6">{option.title}</Typography>
            <ArrowForwardIosIcon />
          </Paper>
        ))}
      </Container>
    </Box>
  )
}

export default Home
