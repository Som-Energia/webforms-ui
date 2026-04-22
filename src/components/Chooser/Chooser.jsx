import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import Checkbox from '@mui/material/Checkbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { chooserStyles, chooserSelectedStyles } from './chooserStyles'


const Option = ({
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
        justifyContent: 'space-between'
      }}
      tabIndex={0}
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

const Chooser = (props) => {
  const { options, value, handleChange, name, maxWidth } = props

  const xsSize = options.length == 2 ? 12 : 12
  const smSize = options.length == 2 ? 6 : 12
  const mdSize = options.length == 2 ? 6 : 8
  const lgSize = options.length == 2 ? 6 : 4

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
        <Grid key={index} item xs={xsSize} sm={smSize} md={mdSize} lg={lgSize}>
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
