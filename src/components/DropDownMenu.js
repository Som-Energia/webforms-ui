import React from 'react'
import { styled } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const StyledAccordion = styled(Accordion)(() => ({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
}))

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .06)',
    mb: 2,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
}))

const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  root: {
    padding: 2
  }
}))

export default function DropDownMenu({ title, sections = [] }) {
  const [expanded, setExpanded] = React.useState('')

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <Box>
      {title ? (
        <Grid
          container
          item
          sx={{ backgroundColor: 'rgba(0, 0, 0, .06)', padding: '3%' }}>
          <Typography style={{ fontSize: '16px' }} variant="subtitle1">
            {title}
          </Typography>
        </Grid>
      ) : null}
      {sections.map((element, index) => {
        return (
          <StyledAccordion
            key={element.title}
            square
            expanded={expanded === 'panel' + index}
            onChange={handleChange('panel' + index)}>
            <StyledAccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header">
              <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item xs={1}>
                  <Typography variant="body1">
                    {expanded === 'panel' + index ? '−' : '+'}
                  </Typography>
                </Grid>
                <Grid item xs={11}>
                  <Typography variant="body2">{element.title}</Typography>
                </Grid>
              </Grid>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{ __html: element.text }}
              />
            </StyledAccordionDetails>
          </StyledAccordion>
        )
      })}
    </Box>
  )
}
