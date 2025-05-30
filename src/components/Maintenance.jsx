import React, { useEffect } from 'react'
import Container from '@mui/material/Container'

import { useTranslation } from 'react-i18next'

import manteniment from '../images/tasques-manteniment-web.svg'

const Maintenance = () => {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const language = window.location.pathname.split('/')[1]
    if (['ca', 'es', 'eu', 'gl'].includes(language)) {
      i18n.changeLanguage(language)
    }
  }, [])

  return (
    <Container sx={{ flexGrow: 1, padding: 12 }}>
      <div
        style={{
          display: 'block',
          textAlign: 'center',
          alignItems: 'center'
        }}>
        <img src={manteniment} alt="Estem en mode manteniment" />
      </div>
      <div
        style={{
          marginTop: '15px',
          color: 'primary.main',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '4em',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
        {t('MAINTENANCE_TEXT1')}
      </div>
      <div
        style={{
          marginTop: '15px',
          color: 'primary.light',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '5em',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
        {t('MAINTENANCE_TEXT2')}
      </div>
    </Container>
  )
}

export default Maintenance
