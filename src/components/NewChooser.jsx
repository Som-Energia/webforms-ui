import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import Checkbox from '@mui/material/Checkbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'


const Option = ({
  isSelected,
  setSelected,
  optionId,
  icon,
  textHeader,
  textBody,
  maxWidth
}) => {

  const chooser = {
    paddingTop: '1.5rem',
    paddingBottom: '2rem',
    paddingLeft: '1.625rem',
    paddingRight: '1.625rem',
    borderRadius: '8px',
    border: '1px solid #D9D9D9',
    cursor: 'pointer'
  }

  const chooserSelected = {
    ...chooser,
    backgroundColor: 'secondary.extraLight'
  }

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
      tabIndex={1}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          setSelected(optionId)
        }
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
              variant="body.md.medium"
              sx={{
                textAlign: 'center',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                maxWidth: {maxWidth},
                display: 'inline-block',
              }}
              >
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
        <Typography variant="body.sm.regular">{textBody}</Typography>
      </Box>
    </Box>
  )
}

const Chooser = (props) => {
  const { options, value, handleChange, name, maxWidth } = props

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
            maxWidth={maxWidth}
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
