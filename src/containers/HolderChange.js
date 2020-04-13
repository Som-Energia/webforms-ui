import React, { Component } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: '25ch'
  }
}))

class HolderChange extends Component {
  render () {
    // const classes = useStyles()
    return (
      <Container maxWidth="md">
        <Paper elevation={3} className="holder-change wizard__step">
          <Typography className="step__title" variant="h5" component="h6">Holder Change</Typography>
          <p className="step__desc">Aquest formulari permet realitzar un canvi de titularitat d’un contracte actiu amb Som Energia.</p>
          <p className="step__desc">Indica el NIF de la persona o entitat jurídica que serà la nova titular del contracte:</p>
          <TextField
            id="nif"
            label="Número d'identificació fiscal (NIF)"
            variant="outlined"
            fullWidth
          />
          <p className="small">Si no disposes de NIE i tens passaport, pots enviar-nos un correu a modifica@somenergia.coop amb les dades del punt de subministrament que vols canviar (número de contracte i CUPS), les dades de la nova persona titular (nom, cognoms, passaport adjunt, correu electrònic i telèfon de contacte) i dades IBAN de pagament.</p>
          
          <Button variant="contained" color="primary">Següent pas</Button>
        </Paper>
      </Container>
    )
  }
}

export default HolderChange
