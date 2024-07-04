import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Fade from '@mui/material/Fade'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import { apiStatus } from '../services/api'

const ApiStatus = () => {
  const { t } = useTranslation()
  const [apiOffline, setApiOffline] = useState(false)
  const [noConnection, setNoConnection] = useState(false)

  const checkApiStatus = async () => {
    apiStatus()
      .then((response) => {
        response?.data?.status
          ? response?.data?.status === 'OFFLINE'
            ? setApiOffline(true)
            : setApiOffline(false) && setNoConnection(false)
          : setNoConnection(true)
      })
      .catch((error) => {
        console.error(error)
        setNoConnection(true)
      })
  }

  useEffect(() => {
    checkApiStatus()
    const interval = setInterval(() => checkApiStatus(), 1200000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {
        <Snackbar open={noConnection || apiOffline} TransitionComponent={Fade}>
          <Alert severity="error">
            <AlertTitle>
              {noConnection ? t('API_SERVER_ERROR') : t('API_SERVER_OFFLINE')}
            </AlertTitle>
            {noConnection
              ? t('API_SERVER_ERROR_DETAILS')
              : t('API_SERVER_OFFLINE_DETAILS')}
          </Alert>
        </Snackbar>
      }
    </>
  )
}

export default ApiStatus
