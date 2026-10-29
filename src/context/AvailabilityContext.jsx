import React, { createContext, useEffect, useState } from "react"

import Maintenance from "../components/Maintenance"
import { AppUtils } from "../utils/app.utils"

const AvailabilityContext = createContext()

export const AvailabilityContextProvider = ({ children }) => {
  const [availability, setAvailability] = useState(true)

  useEffect(() => {
    if (!availability) {
      try {
        AppUtils.openExternalPopup()
      } catch (err) {
        console.error(err)
      }
    }
  }, [availability])

  return (
    <AvailabilityContext.Provider
      value={{
        availability: availability,
        setAvailability: setAvailability,
      }}>
      {availability ? children : <Maintenance />}
    </AvailabilityContext.Provider>
  )
}

export default AvailabilityContext
