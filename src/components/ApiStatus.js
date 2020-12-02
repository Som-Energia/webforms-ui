import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Fade from '@material-ui/core/Fade'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

import { apiStatus } from '../services/api'

const ApiStatus = () => {
  const { t } = useTranslation()
  const [apiOffline, setApiOffline] = useState(false)
  const [noConnection, setNoConnection] = useState(false)

  const checkApiStatus = async () => {
    console.log('checking API status...')
    apiStatus()
      .then(response => {
        response?.data?.status
          ? response?.data?.status === 'OFFLINE'
            ? setApiOffline(true)
            : setApiOffline(false) && setNoConnection(false)
          : setNoConnection(true)
      })
      .catch(error => {
        console.log(error)
        setNoConnection(true)
      })
  }

  useEffect(() => {
    checkApiStatus()
    const interval = setInterval(() => checkApiStatus(), 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {
        <Snackbar open={noConnection || apiOffline} TransitionComponent={Fade}>
          <Alert severity="error">
            <AlertTitle>{ noConnection ? t('API_SERVER_ERROR') : t('API_SERVER_OFFLINE') }</AlertTitle>
            { noConnection ? t('API_SERVER_ERROR_DETAILS') : t('API_SERVER_OFFLINE_DETAILS') }
          </Alert>
        </Snackbar>
      }
    </>
  )
}

export default ApiStatus
