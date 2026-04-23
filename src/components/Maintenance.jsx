import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'

import { useSyncLanguage } from '../hooks/useTranslateOptions'
import manteniment from '../images/manteniment-web.svg'
import { MaintenanceIcon } from '../data/icons/Icons'

const Maintenance = () => {
  const { t } = useTranslation()

  let language = window.location.pathname.split('/')[1]
  language = ['ca', 'es', 'eu', 'gl'].includes(language) ? language : 'es'

  useSyncLanguage(language)

  return (
    <Container sx={{ flexGrow: 1, padding: 2 }}>
      <div
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          borderRadius: '10px',
          backgroundSize: 'cover',
          backgroundImage: `url(${manteniment})`
        }}>
        <div style={{  bottom: '2rem', padding: '3.5rem', gap: '22px', display: 'flex', flexDirection: 'column' }}>
          <div>
            <MaintenanceIcon/>
          </div>
          <div
            style={{
              color: '#0B2E34',
              fontSize: '60px',
              fontWeight: 'bold',
              lineHeight: '70px',
            }}>
            {t('MAINTENANCE_TEXT1')}
          </div>
          <div
            style={{
              color: 'primary.main',
              fontSize: '54px',
              lineHeight: '59px',
            }}>
            {t('MAINTENANCE_TEXT2')}
          </div>
        </div>
      </div>

    </Container>
  )
}

export default Maintenance
