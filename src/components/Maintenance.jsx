import React from 'react'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'

import { useSyncLanguage } from '../hooks/useTranslateOptions'
import manteniment from '../images/tasques-manteniment-web.svg'

const Maintenance = () => {
  const { t } = useTranslation()

  let language =  window.location.pathname.split('/')[1]
  language = ['ca', 'es', 'eu', 'gl'].includes(language)? language:'es'

  useSyncLanguage(language)

  return (
    <Container sx={{ flexGrow: 1, padding: 2 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
        <img style={{width: '65vw'}} src={manteniment} alt="Estem en mode manteniment" />
      </div>
      <div
        style={{
          display:'flex',
          justifyContent:'center',
          marginTop: '15px',
          color: 'primary.main',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
        {t('MAINTENANCE_TEXT1')}
      </div>
      <div
        style={{
          display:'flex',
          justifyContent:'center',
          marginTop: '15px',
          color: 'primary.light',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
        {t('MAINTENANCE_TEXT2')}
      </div>
    </Container>
  )
}

export default Maintenance
