import { useContext, useEffect, useState } from "react"

import AvailabilityContext from "../context/AvailabilityContext"
import { apiStatus } from "../services/api"

const ApiStatus = () => {
  const [apiOffline, setApiOffline] = useState(false)
  const [noConnection, setNoConnection] = useState(false)
  const { availability, setAvailability } = useContext(AvailabilityContext)

  // FIXME: Once availability becomes false, the app can get stuck in Maintenance.
  // This component is mounted inside AvailabilityContext's children subtree, so it
  // stops polling after the subtree is replaced. The ONLINE branch also does not
  // reliably clear both outage flags (`setApiOffline(false) && setNoConnection(false)`).
  useEffect(() => {
    if (apiOffline || noConnection) {
      setAvailability(false)
    } else if (availability) {
      setAvailability(true)
    }
  }, [apiOffline, noConnection])

  const checkApiStatus = async () => {
    apiStatus()
      .then((response) => {
        response?.data?.status
          ? response?.data?.status === "OFFLINE"
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
