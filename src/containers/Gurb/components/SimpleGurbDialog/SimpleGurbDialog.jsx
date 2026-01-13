import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import WarningRounded from '@mui/icons-material/WarningRounded'
import Stack from '@mui/material/Stack'
import CancelIcon from '@mui/icons-material/Cancel'
import Typography from '@mui/material/Typography'
import CustomDialog from '../../../../components/CustomDialog'

import useCheckMobileScreen from '../../../../services/checkMobileScreen'
import {
  dialogCancelIcon,
  dialogWarningRounded,
  dialogTitle,
  dialogText,
  dialogIconButton,
  dialogContentStack
} from '../../../../themes/gurbTheme'


const SimpleGurbDialog = ({
  title,
  text1,
  text2,
  setContent,
  severity
}) => {

  const isMobile = useCheckMobileScreen()

  return (
    <CustomDialog
      data-cy="simple-gurb-dialog"
      withBackground={true}
      paperStyles={{
        width: '448px',
        maxWidth: '90vw',
        height: isMobile && severity === 'error' ? '360px' : '300px',
        maxHeight: '80vh',
        margin: '20px'
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        {severity === 'warning' && <WarningRounded sx={dialogWarningRounded} />}
        {severity === 'error' && <CancelIcon sx={dialogCancelIcon} />}
      </Box>

      {title && (
        <DialogTitle id="simple-dialog-title" sx={dialogTitle}>
          <Box>{title && <Typography dangerouslySetInnerHTML={{ __html: title }} />}</Box>
        </DialogTitle>
      )}

      <IconButton
        data-testid="simple-gurb-dialog-close-button"
        aria-label="close"
        onClick={async () => setContent(undefined) }
        sx={dialogIconButton}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack sx={dialogContentStack}>
          <Box>
            {text1 && (
              <Typography
                sx={dialogText(severity)}
                dangerouslySetInnerHTML={{ __html: text1 }}
              />
            )}
          </Box>
          <Box>
            {text2 && (
              <Typography
                sx={dialogText(severity)}
                dangerouslySetInnerHTML={{ __html: text2 }}
              />
            )}
          </Box>
        </Stack>
      </DialogContent>
    </CustomDialog>
  )
}

export default SimpleGurbDialog