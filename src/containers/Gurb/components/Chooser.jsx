import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { textHeader4, textBody1 } from '../gurbTheme'
import Grid from '@mui/material/Grid'

import Checkbox from '@mui/material/Checkbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { chooserGurb, chooserGurbSelected } from '../gurbTheme'

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
      data-cy={optionId}
      sx={isSelected ? chooserGurbSelected : chooserGurb}
      onClick={() => {
        setSelected(optionId)
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          justifyContent: 'space-between'
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
          {icon}
          <Typography sx={textHeader4}>{textHeader}</Typography>
        </Box>
        {isSelected ? (
          <Checkbox
            checked
            icon={<CheckCircleIcon />}
            checkedIcon={<CheckCircleIcon />}
          />
        ) : null}
      </Box>
      <Typography sx={textBody1}>{textBody}</Typography>
    </Box>
  )
}

const Chooser = (props) => {
  const { options, value, handleChange, name } = props

  const setOptionSelection = (option) => {
    handleChange(option)
  }

  return (
    <Grid
      data-cy={name}
      container
      spacing={4}
      direction="row"
      justifyContent="center">
      {options.map((option, index) => (
        <Grid key={index} item sm={6} xs={12}>
          <Option
            isSelected={option?.id === value}
            setSelected={setOptionSelection}
            optionId={option?.id}
            icon={option?.icon}
            textHeader={option?.textHeader}
            textBody={option?.textBody}
          />
          {option?.helper && (
            <Box
              sx={{
                marginTop: '1rem',
                justifyItems: 'center'
              }}>
              {option?.helper}
            </Box>
          )}
        </Grid>
      ))}
    </Grid>
  )
}
export default Chooser
