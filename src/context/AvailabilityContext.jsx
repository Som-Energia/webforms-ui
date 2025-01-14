import React, { useState, createContext } from 'react'
import Maintenance from '../components/Maintenance'

const AvailabilityContext = createContext()

export const AvailabilityContextProvider = ({ children }) => {
  const [availability, setAvailability] = useState(true)

  return (
    <AvailabilityContext.Provider
      value={{
        availability: availability,
        setAvailability: setAvailability
      }}>
      {availability ? children : <Maintenance />}
    </AvailabilityContext.Provider>
  )
}

export default AvailabilityContext
