import React from "react"

import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"

const Loading = (props) => {
  const { description } = props
  return (
    <Box
      data-testid={"loading-component"}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 3,
        minHeight: "33vh",
      }}>
      <CircularProgress sx={{ color: "primary.mainOrange" }} />

      <Typography
        variant="pagesubtitle"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </Box>
  )
}

export default Loading
