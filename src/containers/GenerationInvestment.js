import React, {useCallback, useContext, useState} from 'react'
import SectionTitle from './Generation/SectionTitle'
import GenerationTable from './Generation/GenerationTable'
import { Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import GenerationContext from './Generation/context/GenerationContext';


const useStyles = makeStyles({
    footer:{
        padding:'10px'
    },
    button: {
        background: '#96b633',
        color: '#fff',
    },
  });


function GenerationInvestment() {
    const [editing, setEditing] = useState(false)
    const classes = useStyles()
    const {contracts} = useContext(GenerationContext)

    const handleClick = useCallback(() => {
        setEditing(true)
    },[]) 

  return (
    <>
      <SectionTitle text={'Primer titol'} />
      <SectionTitle text={'Segon titol'} />
      <GenerationTable data={contracts} editing={editing}/>
      <Grid className={classes.footer} container justifyContent='center'>
        <Button variant='contained' className={classes.button} onClick={handleClick}>Canviar la prioritat</Button>
      </Grid>
    </>
  )
}

export default GenerationInvestment
