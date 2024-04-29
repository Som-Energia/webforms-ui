import React, { useState, useMemo } from 'react'

import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material//Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel';

const Chooser = (props) => {
  const {
    question,
    options,
    onChange,
    value,
    disabled,
    name,
    condensed = false,
    canBeEmpty = true
  } = props
  const [selectedOption, setSelectedOption] = useState(value)

  const getStyles = (selected) => {
    const customStyles = {
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
        justifyContent: 'center',
        alignItems: 'flex-start'
      },
      chooserItemCondensed: {
        minHeight: '40px',
        pt: 1,
        pb: 1
      },
      chooserItemSelected: {
        margin: '0 0 8px 0',
        border: '1px solid #96b633',
        backgroundColor: 'rgba(150, 182, 51, 0.08)',
        '&:hover': {
          border: '1px solid #96b633',
          backgroundColor: 'rgba(150, 182, 51, 0.08)'
        }
      },
      chooserItemDisabled: {
        cursor: 'not-allowed',
        color: 'rgba(0, 0, 0, 0.54)',
        '&:hover': {
          border: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: 'inherit'
        }
      },
    }

    let customStylesArray = []

    customStylesArray.push(customStyles.chooserItem)
    condensed && customStylesArray.push(customStyles.chooserItemCondensed)
    disabled && customStylesArray.push(customStyles.chooserItemDisabled)
    selected && customStylesArray.push(customStyles.chooserItemSelected)
    return customStylesArray
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

  return (
    <>
      <Typography
        variant="h6"
        sx={{ fontSize: '1rem', mt: 2 }}
        dangerouslySetInnerHTML={{ __html: question }}
      />
      <RadioGroup sx={{ mt: 3 }} defaultValue="" name={name} data-cy={name}>
        <Grid container spacing={3}>
          {options.map((option, index) => (
            <Grid key={index} item xs={12} sm={6}>
              <InputLabel
                data-value={option.value}
                id={option.id || option.value}
                onClick={(event) =>
                  !disabled && handleClick(event, option.value)
                }
                sx={getStyles(selectedOption === option.value)}>
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
              </InputLabel>
              {option.helper}
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </>
  )
}

Chooser.defaultProps = {
  onChange: (event) => console.log('change', event.value)
}

export default Chooser