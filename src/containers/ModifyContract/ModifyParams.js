import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import { TextField, Typography, Grid, MenuItem, Switch, Box, Button, FormHelperText } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}))

function ModifyParams ({ nextStep, prevStep, handleChange }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const [changePhases, setChangePhases] = useState(false)
  const [changePower, setChangePower] = useState(false)
  const [changeFare, setChangeFare] = useState(false)

  const onSubmit = data => {
    console.log(data)
  }

  return (
    <div>
      <Box mx={3} mb={5}>
        <Typography variant="h6" gutterBottom>
          {t('MODIFY_ANSWER_INSTAL_TYPE')}
        </Typography>
        <Typography component="div" gutterBottom>
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>{t('NO')}</Grid>
            <Grid item>
              <Switch
                name="changePhases"
                onChange={() => setChangePhases(!changePhases)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                color="primary"
              />
            </Grid>
            <Grid item>{t('SI')}</Grid>
          </Grid>
        </Typography>
        { changePhases &&
          <TextField
            select
            id="phases"
            name="phases"
            label={t('TIPUS_INSTALLACIO')}
            // onChange={(event) => setPhases(event.target.value) & handleChange(event)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="mono">
              {t('MONOFASICA_NORMAL')}
            </MenuItem>f
            <MenuItem value="tri">
              {t('TRIFASICA')}
            </MenuItem>
          </TextField>
        }
        <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_INSTALL_TYPE', { url: t('HELP_INSTALL_TYPE_URL') }) }}></FormHelperText>
      </Box>
      <Box mx={3} mb={5}>
        <Typography variant="h6" gutterBottom>
          {t('MODIFY_ANSWER_POWER')}
        </Typography>
        <Typography component="div" gutterBottom>
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>{t('NO')}</Grid>
            <Grid item>
              <Switch
                name="changePower"
                onChange={() => setChangePower(!changePower)}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
            <Grid item>{t('SI')}</Grid>
          </Grid>
        </Typography>
        { changePower &&
          <TextField
            id="power"
            name="power"
            label="Quina potència vols contractar?"
            helperText=""
            // onChange={(event) => setPower(event.target.value) & handleChange(event)}
            required
            fullWidth
            variant="outlined"
            margin="normal"
          />
        }
        <FormHelperText dangerouslySetInnerHTML={{ __html: t('HELP_POTENCIA', { url: t('HELP_POTENCIA_URL') }) }}></FormHelperText>
      </Box>
      <Box mx={3} mb={5}>
        <Typography variant="h6" gutterBottom>
          {t('MODIFY_ANSWER_FARE')}
        </Typography>
        <Typography component="div" gutterBottom>
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>{t('NO')}</Grid>
            <Grid item>
              <Switch
                onChange={() => setChangeFare(!changeFare)}
                color="primary"
                name="changeFare"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
            <Grid item>{t('SI')}</Grid>
          </Grid>
        </Typography>
        { changeFare &&
          <TextField
            select
            id="fare"
            name="fare"
            label={t('DISCRIMINACIO_HORARIA')}
            // onChange={ (event) => setFare(event.target.value) & handleChange(event) }
            variant="outlined"
            fullWidth
          >
            <MenuItem value="nodh">
              {t('SENSE_DISCRIMINACIO_HORARIA')}
            </MenuItem>
            <MenuItem value="dh">
              {t('AMB_DISCRIMINACIO_HORARIA')}
            </MenuItem>
          </TextField>
        }
        <FormHelperText
          dangerouslySetInnerHTML={{ __html: t('HELP_DISCRIMINACIO_HORARIA', { url: t('HELP_DISCRIMINACIO_HORARIA_URL') }) }}
        />
      </Box>
      <div className={classes.actionsContainer}>
        {
          prevStep &&
          <Button
            onClick={prevStep}
            className={classes.button}
          >
            {t('PAS_ANTERIOR')}
          </Button>
        }
        {
          nextStep &&
          <Button
            onClick={nextStep}
            className={classes.button}
            color="primary"
            variant="contained"
            disabled={!changePhases && !changePower && !changeFare}
          >
            {t('SEGUENT_PAS')}
          </Button>
        }
      </div>
    </div>
  )
}

export default ModifyParams
