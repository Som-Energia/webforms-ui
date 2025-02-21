import { useState, useEffect, useContext } from 'react'

import { apiStatus } from '../services/api'
import AvailabilityContext from '../context/AvailabilityContext'

const ApiStatus = () => {
  const [apiOffline, setApiOffline] = useState(false)
  const [noConnection, setNoConnection] = useState(false)
  const { availability, setAvailability } = useContext(AvailabilityContext)

  useEffect(() => {
    if (apiOffline || noConnection) {
      setAvailability(false)
    }
    else if (availability) {
      setAvailability(true)
    }
  },[apiOffline, noConnection])

  const checkApiStatus = async () => {
    apiStatus()
      .then((response) => {
        console.log("HOLA RESPONSE",response);
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

}

export default ApiStatus