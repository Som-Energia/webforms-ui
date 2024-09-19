import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { textHeader4, textBody1 } from '../gurbTheme'
import Grid from '@mui/material/Grid'

import Checkbox from '@mui/material/Checkbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { chooserGurg, chooserGurgSelected } from '../gurbTheme'

const Option = ({
  isSelected,
  setSelected,
  optionId,
  icon,
  textHeader,
  textBody
}) => {
  return (
    <Box
      sx={isSelected ? chooserGurgSelected : chooserGurg}
      onClick={() => {
        setSelected(optionId)
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
        {icon}
        {isSelected && (
          <Checkbox
            checked
            icon={<CheckCircleIcon />}
            checkedIcon={<CheckCircleIcon />}
          />
        )}
      </Box>
      <Typography sx={textHeader4}>{textHeader}</Typography>
      <Typography sx={textBody1}>{textBody}</Typography>
    </Box>
  )
}

const Chooser = (props) => {
  const { options, value, handleChange } = props

  const setOptionSelection = (option) => {
    handleChange(option)
  }

  return (
    <Grid container spacing={4}>
      {options.map((option, index) => (
        <Grid key={index} item xs={12} sm={6}>
          <Option
            isSelected={option?.id === value}
            setSelected={setOptionSelection}
            optionId={option?.id}
            icon={option?.icon}
            textHeader={option?.textHeader}
            textBody={option?.textBody}
          />
        </Grid>
      ))}
    </Grid>
  )
}
export default Chooser
