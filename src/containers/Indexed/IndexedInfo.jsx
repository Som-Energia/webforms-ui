import React from "react"

import Box from "@mui/material/Box"

import Card from "../../components/oficinavirtual/Card"
import Header from "../../components/oficinavirtual/Header"

const IndexedInfo = ({ title, desc }) => {
  return (
    <Box
      sx={{
        position: "relative",
        color: "primary",
        overflowWrap: "break-word",
      }}>
      {title ? <Header>{title}</Header> : null}
      {desc ? <Card>{desc}</Card> : null}
    </Box>
  )
}

export default IndexedInfo
