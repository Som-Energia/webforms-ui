import React from 'react'
import Typography from '@mui/material/Typography'
import SimpleGurbDialog from '../../../components/SimpleGurbDialog'

export const buildGurbDialog = ({
  severity,
  setContent,
  titleKey,
  text1Key,
  text2Key
}) => (
  <SimpleGurbDialog
    severity={severity}
    title={<Typography dangerouslySetInnerHTML={{ __html: titleKey }} />}
    text1={
      text1Key ? (
        <Typography
          sx={{ fontSize: 14 }}
          dangerouslySetInnerHTML={{ __html: text1Key }}
        />
      ) : null
    }
    text2={
      text2Key ? (
        <Typography
          sx={{
            fontSize: 14,
            a: {
              color: 'black',
              fontWeight: severity === 'warning' ? 'bold' : 'normal',
              textDecoration: severity === 'warning' ? 'underline' : 'none'
            }
          }}
          dangerouslySetInnerHTML={{ __html: text2Key }}
        />
      ) : null
    }
    closeFunction={async () => setContent(undefined)}
  />
)
