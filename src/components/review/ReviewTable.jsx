import React from 'react'

import useCheckMobileScreen from '../../services/checkMobileScreen'
import ReviewDesktopTable from './ReviewDesktopTable'
import ReviewMobileTable from './ReviewMobileTable'

const ReviewTable = ({ tableFields }) => {
  const isMobile = useCheckMobileScreen()
  return isMobile ? (
    <ReviewMobileTable tableFields={tableFields} />
  ) : (
    <ReviewDesktopTable tableFields={tableFields} />
  )
}

export default ReviewTable