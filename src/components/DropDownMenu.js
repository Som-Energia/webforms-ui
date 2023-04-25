import React from 'react'
import { withStyles,makeStyles } from '@material-ui/core/styles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  menuTitle: {
    backgroundColor: 'rgba(0, 0, 0, .06)',
    padding: "3%"
  }
}))

const Accordion = withStyles({
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
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .06)',
    marginBottom: 2,
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
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiAccordionDetails)

export default function CustomizedAccordions({ title, sections = [] }) {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState('')

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <div>
      {title ? (
        <Grid container item className={classes.menuTitle}>
          <Typography style={{fontSize:'16px'}} variant="subtitle">{title}</Typography>
        </Grid>
      ) : null}
      {sections.map((element, index) => {
        return (
          <Accordion
            key={element.title}
            square
            expanded={expanded === 'panel' + index}
            onChange={handleChange('panel' + index)}>
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header">
              <Grid container className={classes.title}>
                <Grid item xs={1}>
                  <Typography variant="body1">
                    {expanded === 'panel' + index ? '−' : '+'}
                  </Typography>
                </Grid>
                <Grid item xs={11}>
                  <Typography variant="body2">{element.title}</Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" dangerouslySetInnerHTML={{__html:element.text}} />
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}
