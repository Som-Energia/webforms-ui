import Typography from '@mui/material/Typography'
import SimpleGurbDialog from './SimpleGurbDialog'

export const dialogText = (severity) => ({
  fontSize: 14,
  a: {
    color: 'black',
    fontWeight: severity === 'warning' ? 'bold' : 'normal',
    textDecoration: 'underline'
  }
})

export const buildGurbDialog = ({
  severity,
  setContent,
  titleKey,
  text1Key,
  text2Key
}) => (
  <SimpleGurbDialog
    severity={severity}
    title={titleKey && <Typography dangerouslySetInnerHTML={{ __html: titleKey }} />}
    text1={
      text1Key ? (
        <Typography
          sx={dialogText(severity)}
          dangerouslySetInnerHTML={{ __html: text1Key }}
        />
      ) : null
    }
    text2={
      text2Key ? (
        <Typography
          sx={dialogText(severity)}
          dangerouslySetInnerHTML={{ __html: text2Key }}
        />
      ) : null
    }
    closeFunction={async () => setContent(undefined)}
  />
)
