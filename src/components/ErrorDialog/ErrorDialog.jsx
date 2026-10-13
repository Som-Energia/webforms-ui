import CancelIcon from "@mui/icons-material/Cancel"
import CloseIcon from "@mui/icons-material/Close"
import WarningRounded from "@mui/icons-material/WarningRounded"
import Box from "@mui/material/Box"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import useCheckMobileScreen from "../../services/checkMobileScreen"
import CustomDialog from "../CustomDialog"

const severityIcons = {
  error: (
    <CancelIcon
      sx={{
        fontSize: 40,
        color: "error.light",
      }}
    />
  ),
  warning: (
    <WarningRounded
      sx={{
        fontSize: 44,
        color: "warning.light",
        mt: 4,
      }}
    />
  ),
}

const ErrorDialog = ({ title, descriptions, onClose, severity, children }) => {
  const isMobile = useCheckMobileScreen()

  return (
    <CustomDialog
      data-cy="error-dialog"
      withBackground={true}
      paperStyles={{
        width: "448px",
        maxWidth: "90vw",
        height: isMobile && severity === "error" ? "360px" : "300px",
        maxHeight: "80vh",
        margin: "20px",
      }}>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        {severity && severityIcons[severity]}
      </Box>

      {title && (
        <DialogTitle
          id="simple-dialog-title"
          sx={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            mb: -2,
          }}>
          <Box>
            <Typography dangerouslySetInnerHTML={{ __html: title }} />
          </Box>
        </DialogTitle>
      )}

      <IconButton
        data-testid="error-dialog-close-button"
        aria-label="close"
        onClick={async () => onClose(undefined)}
        sx={{
          position: "absolute",
          right: 18,
          top: 18,
          color: "black",
        }}>
        <CloseIcon />
      </IconButton>

      {children && !descriptions?.length && (
        <DialogContent>{children}</DialogContent>
      )}

      {descriptions && Array.isArray(descriptions) && (
        <DialogContent>
          <Stack
            sx={{
              spacing: 2,
              alignItems: "center",
              textAlign: "center",
            }}>
            {descriptions.map((item, index) => (
              <Box key={index}>
                {item && (
                  <Typography
                    sx={{
                      fontSize: 14,
                      a: {
                        color: "black",
                        fontWeight: severity === "warning" ? "bold" : "normal",
                        textDecoration: "underline",
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>
      )}
    </CustomDialog>
  )
}

export default ErrorDialog
