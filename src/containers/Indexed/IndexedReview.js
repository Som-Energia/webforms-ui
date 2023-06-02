import React, { useState } from 'react'
import IndexedReviewData from './IndexedReviewData'


const IndexedReview = (props) => {
  let { setFieldValue, contractValues, values, targetTariff, isTariff20, isTariffIndexed } = props
  const [open, setOpen] = useState(false)
  const [indexadaTermsAccepted, setIndexadaTermsAccepted] = useState(false)
  const [indexadaLegalTermsAccepted, setIndexadaLegalTermsAccepted] =
    useState(false)

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('general_contract_terms_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('general_contract_terms_accepted', false)
  }

  const handleIndexadaTermsAccepted = (data) => {
    setIndexadaTermsAccepted(data)
    setFieldValue('particular_contract_terms_accepted', data)
  }

  return (
    <IndexedReviewData
      contractValues={contractValues}
      values={values}
      isTariff20={isTariff20}
      isTariffIndexed={isTariffIndexed}
      open={open}
      targetTariff={targetTariff}
      indexadaTermsAccepted={indexadaTermsAccepted}
      indexadaLegalTermsAccepted={indexadaLegalTermsAccepted}
      handleClick={handleClick}
      handleAccept={handleAccept}
      handleClose={handleClose}
      handleIndexadaTermsAccepted={handleIndexadaTermsAccepted}
    />
  )
}

export default IndexedReview
