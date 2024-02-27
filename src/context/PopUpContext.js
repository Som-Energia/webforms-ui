import { useState, createContext } from 'react'
import CustomDialog from '../components/CustomDialog'

const PopUpContext = createContext();

export const PopUpContextProvider = ({ children }) => {

const [content, setContent] = useState(undefined);

  return (
    <PopUpContext.Provider value={{ setContent:setContent }}>
      <CustomDialog>{content}</CustomDialog>
      {children}
    </PopUpContext.Provider>
  )
}

export default PopUpContext
