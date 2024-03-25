import React, { useState, createContext } from 'react'

const PopUpContext = createContext();

export const PopUpContextProvider = ({ children }) => {

const [content, setContent] = useState(undefined);

  return (
    <PopUpContext.Provider value={{ setContent:setContent }}>
      <React.Fragment>{content}</React.Fragment>
      {children}
    </PopUpContext.Provider>
  )
}

export default PopUpContext