import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined'
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined'
import MailOutlinedIcon from '@material-ui/icons/MailOutlined'
import PowerSettingsNewOutlinedIcon from '@material-ui/icons/PowerSettingsNewOutlined'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined'
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined'
import RedoOutlinedIcon from '@material-ui/icons/RedoOutlined'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import UndoOutlinedIcon from '@material-ui/icons/UndoOutlined'
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: '4px',
    paddingRight: '4px'
  },
  column: {
    margin: theme.spacing(1),
    padding: '16px 12px 1px 12px',
    textAlign: 'center',
    color: '#4d4d4d',
    backgroundColor: '#ffffff'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    marginBottom: '12px',
    padding: '8px 12px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#96b633',
      color: '#fff'
    }
  },
  activeOption: {
    backgroundColor: '#96b633',
    color: '#fff',
    '&:hover': {
      color: '#4d4d4d'
    },
    '&::before': {
      backgroundColor: '#96b633'
    }
  },
  optionContent: {
    marginBottom: '16px',
    fontSize: '14px'
  },
  optionField: {
    textAlign: 'left',
    padding: '8px 16px'
  },
  label: {
    fontWeight: 500,
    fontSize: '0.9rem',
    color: 'rgba(89, 89, 88, 0.9)'
  },
  mainHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    flexWrap: 'wrap',
    '& h2': {
      fontSize: '32px',
      margin: 0,
      paddingRight: '1rem',
      whiteSpace: 'nowrap'
    }
  },
  mainHeaderInfo: {
    textAlign: 'right',
    fontSize: '0.85rem',
    lineHeight: '1.25rem',
    '& div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  },
  main: {
    marginTop: theme.spacing(2),
    paddingTop: '16px',
    paddingBottom: '16px',
    minHeight: '620px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  phase: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#b1bf82',
    marginBottom: '12px',
    padding: '8px 12px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
    '&:hover': {
    },
    '& div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  futurePhase: {
    backgroundColor: '#f2f2f2',
    color: '#4d4d4d',
    cursor: 'default'
  },
  currentPhase: {
    backgroundColor: '#96b633',
    color: '#fff'
  },
  phaseName: {
    paddingLeft: '8px'
  },
  phaseIcon: {
    opacity: '0.7'
  },
  phaseTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    color: 'rgba(77, 77, 77, 0.65)',
    padding: '0 16px 0 16px',
    '& h3': {
      fontSize: '1em',
      margin: '16px 0 16px 0',
      fontWeight: 500
    }
  },
  mainPhase: {
    display: 'block',
    textAlign: 'left',
    color: '#4d4d4d',
    backgroundColor: '#fff',
    margin: '24px 0',
    '& h3': {
      fontSize: '1.25em',
      fontWeight: 600,
      marginBottom: '24px'
    }
  },
  separator: {
    marginTop: '64px'
  }
}))

const OptionField = ({ label, value }) => {
  const classes = useStyles()
  return (
    <div className={classes.optionField}>
      <div className={classes.label}>{label}</div>
      <div className={classes.value}>{value}</div>
    </div>
  )
}

const SupplyPoint = () => {
  const supplypoint = {
    CUPS: 'ES0031406238503002SCX',
    Direcció: 'Tramuntana, 4, 1r 1a',
    Població: 'Fornells de la Selva',
    'Potència contractada': '4.6 kW',
    'Tarifa d\'accès': '2.0 DHA'
  }

  return (
    Object.entries(supplypoint)
      .map(([label, value]) => (
        <OptionField key={label} label={label} value={value} />
      ))
  )
}

const SomSolet = () => {
  const optionsList = [
    {
      id: 'supplypoint',
      title: 'Punt de suministrament',
      content: <SupplyPoint />
    },
    {
      id: 'project',
      title: 'Projecte',
      content: <></>
    },
    {
      id: 'person',
      title: 'Persona inscrita',
      content: <></>
    },
    {
      id: 'inscription',
      title: 'Inscripció inicial',
      content: <></>
    },
    {
      id: 'final',
      title: 'Proposta final',
      content: <></>
    }
  ]

  const getPhase = (phasesList, phaseId, withContent = false) => {
    const { title, content } = phasesList.find(({ id }) => phaseId === id)
    return <>
      <h3>{title}</h3>
      {
        withContent &&
        <div>
          { content }
        </div>
      }
    </>
  }

  const phasesList = [
    {
      id: 'welcome',
      title: 'Benvinguda i Condicions Generals',
      content: <></>
    },
    {
      id: 'about',
      title: 'Presentació empresa instal·ladora',
      content: <></>
    },
    {
      id: 'preinforme',
      title: 'Pre-Informe',
      content: <>Descarrega el pre-informe</>
    },
    {
      id: 'datetechnicalvisit',
      title: 'Acordar data i hora visita tècnica',
      content: <></>
    },
    {
      id: 'technicalvisitinform',
      title: 'Informe visita Tècnica',
      content: <></>
    },
    {
      id: 'finaloffert',
      title: 'Proposta d\'oferta final',
      content: <></>
    },
    {
      id: 'contractsign',
      title: 'Signatura Contracte Clau en mà',
      content: <></>
    },
    {
      id: 'midprojectinvoice',
      title: 'Factura 50%',
      content: <></>
    },

    {
      id: 'workpermit',
      title: 'Permís d\'obra',
      content: <></>
    },
    {
      id: 'choosedate',
      title: 'Acordar data d\'obra',
      content: <></>
    },
    {
      id: 'reception',
      title: 'Acta de recepció',
      content: <></>
    },

    {
      id: 'invoice40',
      title: 'Factura 40%',
      content: <></>
    },
    {
      id: 'legalization',
      title: 'Legalització',
      content: <></>
    },
    {
      id: 'documentation',
      title: 'Descarrega documentació',
      content: <></>
    },
    {
      id: 'invoice10',
      title: 'Factura 10%',
      content: <></>
    },
    {
      id: 'poll',
      title: 'Enquesta de satisfacció',
      content: <></>
    },
    {
      id: 'thanks',
      title: 'Agraïments i comiat',
      content: <></>
    }
  ]

  const classes = useStyles()
  const [activeOption, setActiveOption] = useState(0)
  const [currentPhase] = useState('preinforme')
  const [prevPhase] = useState('about')
  const [nextPhase] = useState('datetechnicalvisit')
  let afterCurrent = false

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container>
        <Grid item sm={3} xs={12}>
          <div className={classes.column}>
            {
              optionsList.map(({ title, content }, index) => (
                <div key={title}>
                  <div
                    className={clsx(classes.option, activeOption === index && classes.activeOption)}
                    onClick={ event => { activeOption === index ? setActiveOption(false) : setActiveOption(index) }}
                  >
                    {
                      activeOption === index ? <ArrowDropDownIcon fontSize="small" /> : <ArrowRightIcon fontSize="small" />
                    }
                    &nbsp;{title}
                  </div>
                  {
                    activeOption === index &&
                    <div className={classes.optionContent}>
                      { content }
                    </div>
                  }
                </div>
              ))
            }

            <div className={classes.separator}> </div>

            <div className={classes.option}>
              <div className={classes.phaseIcon}>
                <MailOutlinedIcon fontSize="small" />
              </div>
              <div className={classes.phaseName}>
                Contacte instal·ladora
              </div>
            </div>

            <div className={classes.option}>
              <div className={classes.phaseIcon}>
                <ReportProblemOutlinedIcon fontSize="small" />
              </div>
              <div className={classes.phaseName}>
                Notifica incidència
              </div>
            </div>

            <div className={classes.option}>
              <div className={classes.phaseIcon}>
                <PowerSettingsNewOutlinedIcon fontSize="small" />
              </div>
              <div className={classes.phaseName}>
                &nbsp;&nbsp;Donar-se de baixa
              </div>
            </div>
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className="">
            <div className={clsx(classes.column, classes.mainHeader)}>
              <h2>Gir Solar</h2>
              <div className={classes.mainHeaderInfo}>
                <div><RoomOutlinedIcon fontSize="small" />&nbsp;Alt Empordà, Baix Empordà, Garrotxa, Gironès i Pla de l’Estany</div>
                <div><WbSunnyOutlinedIcon fontSize="small" />&nbsp;150 instal·lacions &nbsp;<SettingsOutlinedIcon fontSize="small" />&nbsp;Audit Energia</div>
              </div>
            </div>
            <div className={clsx(classes.column, classes.main)}>
              <div className={{}}>
                <div className={classes.phaseTitle}>
                  {
                    getPhase(phasesList, prevPhase)
                  }
                  <UndoOutlinedIcon />
                </div>
                <div className={clsx(classes.phaseTitle, classes.mainPhase)}>
                  {
                    getPhase(phasesList, currentPhase, true)
                  }
                </div>
              </div>
              <div className={classes.phaseTitle}>
                {
                  getPhase(phasesList, nextPhase)
                }
                <RedoOutlinedIcon />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item sm={3} xs={12}>
          <div className={classes.column}>
            {
              phasesList.map(({ id, title }) => {
                afterCurrent = afterCurrent || currentPhase === id
                return (
                  <div
                    key={id}
                    className={clsx(classes.phase, afterCurrent && classes.futurePhase, currentPhase === id && classes.currentPhase)}
                  >
                    <div className={classes.phaseIcon}>
                      { afterCurrent ? <CheckBoxOutlineBlankOutlinedIcon /> : <CheckBoxOutlinedIcon /> }
                    </div>
                    <div className={classes.phaseName}>
                      { title }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SomSolet
