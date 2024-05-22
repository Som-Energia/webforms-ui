import React, { useState, useMemo } from 'react'

import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material//Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'

const Chooser = (props) => {
  const {
    question,
    options,
    onChange = (event) => console.log('change', event.value),
    value,
    disabled,
    name,
    condensed = false,
    canBeEmpty = true,
    alignTop = false
  } = props
  const [selectedOption, setSelectedOption] = useState(value)


  const customStyles = {
    chooserItemAlignTop: {
      justifyContent:'flex-start'
    },
    chooserItemAlignCenter:{
      justifyContent:'center'
    },
    chooserItem: {
      cursor: 'pointer',
      minHeight: '100px',
      height: '100%',
      pt: 1,
      pb: 1,
      pr: 3,
      pl: 3,
      border: '1px solid rgba(0, 0, 0, 0.12)',
      margin: '0 0 8px 0',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.87)',
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    chooserItemCondensed: {
      minHeight: '40px',
      pt: 1,
      pb: 1
    },
    chooserItemSelected: {
      margin: '0 0 8px 0',
      border: '1px solid',
      borderColor: 'primary.main',
      backgroundColor: 'primary.extraLight',
      '&:hover': {
        border: '1px solid',
        borderColor: 'primary.main',
        backgroundColor: 'primary.extraLight'
      }
    },
    chooserItemDisabled: {
      cursor: 'not-allowed',
      color: 'rgba(0, 0, 0, 0.54)',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundColor: 'inherit'
      }
    }

  }


  const handleClick = (event, value) => {
    // Do not handle here click if a link inside
    // the description is clicked
    if (event.target.tagName === 'A') return

    event.preventDefault()
    if (!canBeEmpty || selectedOption !== value) {
      setSelectedOption(value)
      onChange({ option: value })
    } else {
      setSelectedOption(undefined)
      onChange({ option: undefined })
    }
  }


  //console.log(getStyles(selectedOption === option.value))

  return (
    <>
      <Typography
        variant="h6"
        sx={{ fontSize: '1rem', mt: 2 }}
        dangerouslySetInnerHTML={{ __html: question }}
      />
      <RadioGroup sx={{ mt: 3 }} defaultValue="" name={name} data-cy={name}>
        <Grid container spacing={3} >
          {options.map((option, index) => (
            <Grid key={index} item xs={12} sm={6}>
              <Box
                data-value={option.value}
                id={option.id || option.value}
                onClick={(event) =>
                  !disabled && handleClick(event, option.value)
                }
                sx={[
                  alignTop ? customStyles.chooserItemAlignTop : customStyles.chooserItemAlignCenter,
                  customStyles.chooserItem,
                  condensed && customStyles.chooserItemCondensed,
                  selectedOption === option.value && customStyles.chooserItemSelected,
                  disabled && customStyles.chooserItemDisabled
                ]}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Radio
                    disabled={disabled}
                    value={option.value}
                    color="primary"
                    checked={selectedOption === option.value}
                  />
                  <Typography>{option.label}</Typography>
                </Box>
                {option.description && (
                  <FormHelperText
                    sx={{ mt: 1, pl: 1 }}
                    dangerouslySetInnerHTML={{ __html: option.description }}
                  />
                )}
              </Box>
              {option.helper}
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </>
  )
}

export default Chooser