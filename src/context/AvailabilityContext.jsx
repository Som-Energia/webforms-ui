import React, { createContext, useEffect, useState } from "react"

import Maintenance from "../components/Maintenance"

const AvailabilityContext = createContext()

export const AvailabilityContextProvider = ({ children }) => {
  const [availability, setAvailability] = useState(true)

  useEffect(() => {
    if (!availability) {
      // Open an external help dialog when api is down
      window.openForm?.()
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
