import React, { useEffect } from 'react'


const StepHeader = ({title}) => {

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__text">
          {title}
        </div>
      </div>
      <div className="header__after"></div>
    </div>
  )
}

export default StepHeader
