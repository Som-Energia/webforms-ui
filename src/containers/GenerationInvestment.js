import React, { useCallback, useContext, useState } from 'react'
import SectionTitle from './Generation/SectionTitle'
import GenerationTable from './Generation/GenerationTable'
import { Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GenerationContext from './Generation/context/GenerationContext'

const useStyles = makeStyles({
  footer: {
    padding: '10px'
  },
  button: {
    background: '#96b633',
    color: '#fff'
  }
})

const investmentJSON = document.getElementById('generation-investments-data').textContent

function GenerationInvestment() {

  console.log(investmentJSON)
  const [editing, setEditing] = useState(false)
  const classes = useStyles()
  const { contracts } = useContext(GenerationContext)

  const handleClick = useCallback((state) => {
    setEditing(state)
  }, [])

  const ActionSection = useCallback(() => {
    return (
      <>
        {editing ? (
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => handleClick(false)}>
            Cancelar 
          </Button>
        ) : (
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => handleClick(true)}>
            Canviar la prioritat
          </Button>
        )}
      </>
    )
  },[editing,classes,handleClick])

  return (
    <>
      <SectionTitle text={'Primer titol'} />
      <SectionTitle text={'Segon titol'} />
      <GenerationTable data={contracts} editing={editing} />
      <Grid className={classes.footer} container justifyContent="center">
        <ActionSection />
      </Grid>
    </>
  )
}

export default GenerationInvestment
