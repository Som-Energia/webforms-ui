
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Checkbox from '@mui/material/Checkbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { chooserStyles, chooserSelectedStyles } from './chooserStyles'


const TemporalOption = ({
  isSelected,
  setSelected,
  optionId,
  icon,
  textHeader,
  textBody,
  maxWidth
}) => {

  return (
    <Box
      role="button"
      data-cy={optionId}
      sx={{
        ...(isSelected ? chooserSelectedStyles : chooserStyles),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      tabIndex={0}
      onClick={() => {
        setSelected(optionId)
      }}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.0rem',
            justifyContent: 'space-between'
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
            {icon}
            <Typography
              variant="body.md.medium"
              sx={{
                textAlign: 'center',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                maxWidth: { maxWidth },
                display: 'inline-block',
              }}
            >
              {textHeader}
            </Typography>
          </Box>
          {isSelected ? (
            <Checkbox
              tabIndex={-1}
              checked
              icon={<CheckCircleIcon />}
              checkedIcon={<CheckCircleIcon />}
            />
          ) : null}
        </Box>
        <Typography variant="body.sm.regular" color="secondary.extraDark">{textBody}</Typography>
      </Box>
    </Box>
  )
}

export default TemporalOption