import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import Checkbox from '@mui/material/Checkbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { chooser, chooserSelected } from '../themes/webforms/'

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
      sx={{
        ...(isSelected ? chooserSelected : chooser),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
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
              sx={{
                ...'body.sm.regular',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100%'
              }}>
              {textHeader}
            </Typography>
          </Box>
          {isSelected ? (
            <Checkbox
              checked
              icon={<CheckCircleIcon />}
              checkedIcon={<CheckCircleIcon />}
            />
          ) : null}
        </Box>
        <Typography sx={'body.sm.regular'}>{textBody}</Typography>
      </Box>
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
