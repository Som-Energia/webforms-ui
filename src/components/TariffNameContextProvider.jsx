import { createContext, useState } from 'react'
import { DefaultTariff } from '../data/tariff'

const TariffNameContext = createContext()

export const TariffNameContextProvider = ({ children }) => {
  const [tariffName, setTariffName] = useState(DefaultTariff)

  return (
    <TariffNameContext.Provider value={{ tariffName, setTariffName }}>
      {children}
    </TariffNameContext.Provider>
  )
}

export default TariffNameContext
