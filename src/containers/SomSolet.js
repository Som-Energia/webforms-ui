import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
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

import Loading from '../components/Loading'
import ContactDialog from '../containers/SomSolet/ContactDialog'
import IncidenceDialog from '../containers/SomSolet/IncidenceDialog'

// services
import { getCampaign, getProject, sendContact, sendIncidence } from '../services/somsolet/api'
import i18next from 'i18next'

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
  fullHeight: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 34px)'
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
      alignItems: 'center',
      justifyContent: 'flex-end',
      display: 'flex'
    }
  },
  engineeringInfo: {
    paddingTop: '8px',
    paddingBottom: '16px'
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
    color: '#fff',
    cursor: 'pointer'
  },
  phaseName: {
    paddingLeft: '8px'
  },
  phaseIcon: {
    display: 'flex',
    alignItems: 'center',
    opacity: '0.7'
  },
  phaseTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    color: 'rgba(77, 77, 77, 0.65)',
    padding: '0 16px 0 16px',
    cursor: 'pointer',
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
    padding: '0 16px 0 16px',
    '& h3': {
      fontSize: '1.25em',
      fontWeight: 600,
      marginBottom: '24px'
    }
  },
  separator: {
    flexGrow: 1
  },
  noResults: {
    fontSize: '1rem',
    fontWeight: 400,
    margin: 0
  },
  noResultsContainer: {
    marginTop: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
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

const PhaseInfo = ({ data }) => {
  return (
    Object.entries(data)
      .map(([label, value]) => {
        switch (label) {
          case 'file':
            return <OptionField
              key={label}
              label={''}
              value={
                <Button
                  size="small"
                  variant='contained'
                  color='primary'
                  target='_blank'
                  href={value}
                >
                    Descarrega
                </Button>
              }
            />
          case 'action':
            return <OptionField
              key={label}
              label={''}
              value={
                <Button
                  size="small"
                  variant='contained'
                  color='primary'
                  target='_blank'
                  href={value}
                >
                  Som-hi!
                </Button>
              }
            />
          case 'date':
            return <OptionField key={label} label={'Data'} value={value} />
          default:
            if (`${value}`.match('https:')) {
              return <OptionField
                key={label}
                label={''}
                value={
                  <Button
                    size="small"
                    variant='contained'
                    color='primary'
                    target='_blank'
                    href={value}
                  >
                    { label }
                  </Button>
                }
              />
            }
            return <OptionField key={label} label={label} value={value ? 'Sí' : 'No'} />
        }
      })
  )
}

const SupplyPoint = (props) => {
  const { supplyPointInfo } = props
  const supplypoint = {
    CUPS: supplyPointInfo.cups,
    Direcció: supplyPointInfo.address?.street,
    Població: `${supplyPointInfo.address?.town} (${supplyPointInfo.address?.municipality})`,
    'Potència contractada': `${supplyPointInfo.power} kW`,
    'Tarifa d\'accès': supplyPointInfo.tariff
  }
  return (
    Object.entries(supplypoint)
      .map(([label, value]) => (
        <OptionField key={label} label={label} value={value} />
      ))
  )
}

const Project = (props) => {
  const { projectInfo } = props
  const project = {
    Nom: projectInfo.name,
    Campanya: projectInfo.campaign,
    'Data inici': projectInfo.dateStart
  }
  return (
    Object.entries(project)
      .map(([label, value]) => (
        <OptionField key={label} label={label} value={value} />
      ))
  )
}

const RegisteredPerson = (props) => {
  const { registeredPersonInfo } = props
  const registeredPerson = {
    Nom: registeredPersonInfo.name,
    Email: registeredPersonInfo.email,
    Telèfon: registeredPersonInfo.phoneNumber,
    Idioma: registeredPersonInfo.language
  }
  return (
    Object.entries(registeredPerson)
      .map(([label, value]) => (
        <OptionField key={label} label={label} value={value} />
      ))
  )
}

const Preregistration = (props) => {
  const { preregistrationInfo } = props
  const preregisrtation = {
    Data: preregistrationInfo.date,
    Pagat: preregistrationInfo.paid ? 'Sí' : 'No'
  }
  return (
    Object.entries(preregisrtation)
      .map(([label, value]) => (
        <OptionField key={label} label={label} value={value} />
      ))
  )
}

const Registered = (props) => {
  const { registeredInfo } = props
  const registered = {
    Data: registeredInfo.date
  }
  return (
    Object.entries(registered)
      .map(([label, value]) => (
        <OptionField key={label} label={label} value={value} />
      ))
  )
}

const SomSolet = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const [stages, setStages] = useState([])
  const [campaign, setCampaign] = useState([])
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true)
  const [project, setProject] = useState([])
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [activeOption, setActiveOption] = useState(0)
  const [activePhase, setActivePhase] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('preinforme')
  const [prevPhase, setPrevPhase] = useState('prereport')
  const [nextPhase, setNextPhase] = useState('technicalVisit')

  const [openContact, setOpenContact] = useState(false)
  const [openIncidence, setOpenIncidence] = useState(false)
  const [isSending, setSending] = useState(false)

  let afterCurrent = false

  useEffect(() => {
    const language = props.match.params.language
    i18n.changeLanguage(language)
  }, [props.match.params.language, i18n])

  useEffect(() => {
    setIsLoadingProject(true)
    console.log('getProject')
    getProject({ dni: '', language: props.match.params.language }) // TODO: find vat from OV
      .then(response => {
        const projectInfo = response[0] // TODO: to check
        console.log('projectInfo', projectInfo)
        const projectDescription = projectInfo.description
        const project = getProjectList(projectDescription)
        console.log('project', project)
        setProject(project.reverse())
        const stages = projectInfo.stages
        const phasesList = getPhasesList(stages)
        setStages(phasesList)
        console.log('phasesList', phasesList)
        setCurrentPhase(projectDescription?.stageId)
        setActivePhase(projectDescription?.stageId)
        console.log(projectDescription?.stageId)
        setIsLoadingProject(false)
      }).catch(error => {
        console.log(error)
        setIsLoadingProject(false)
      })
  }, [])

  useEffect(() => {
    setIsLoadingCampaign(true)
    getCampaign()
      .then(response => {
        const campaign = response[0] // TODO: to check
        setCampaign(campaign)
        setIsLoadingCampaign(false)
      }).catch(error => {
        console.log(error)
        setIsLoadingCampaign(false)
      })
  }, [])

  useEffect(() => {
    if (stages.length) {
      const itemPhase = stages.find((item) => item.id === activePhase)
      const indexPhase = stages.indexOf(itemPhase)
      const prevIndexPhase = indexPhase - 1
      const nextIndexPhase = indexPhase + 1
      setPrevPhase(prevIndexPhase >= 0 ? stages[prevIndexPhase]?.id : false)
      setNextPhase(nextIndexPhase <= stages.length ? stages[nextIndexPhase]?.id : false)
    }
  }, [activePhase, stages])

  const getPhasesList = (stages) => {
    const phasesist = []
    Object.entries(stages).map(([key, value], index) => {
      if (key !== 'stageId' && key !== 'discardedType') {
        const title = getPhaseTitle(key)
        const content = getPhaseContent(key, value)
        const info = {
          id: key,
          title: title,
          content: content
        }
        phasesist.push(info)
      }
    })
    return phasesist
  }

  const getProjectList = (projectDescription) => {
    const project = []
    Object.entries(projectDescription)
      .map(([key, value]) => {
        const content = getOptionContent(key, value)
        const title = getOptionTitle(key)
        const info = {
          id: key,
          title: title,
          content: content
        }
        project.push(info)
      })
    return project
  }

  // TODO: Refactor
  const getOptionTitle = (key) => {
    switch (key) {
      case 'supplyPoint':
        return 'Punt de Subministrament'
      case 'project':
        return 'Projecte'
      case 'registeredPerson':
        return 'Persona inscrita'
      case 'preregistration':
        return 'Inscripció inicial'
      case 'registered':
        return 'Proposta final'
      default:
        return ''
    }
  }

  const getOptionContent = (key, value) => {
    switch (key) {
      case 'supplyPoint':
        return <SupplyPoint supplyPointInfo={value}/>
      case 'project':
        return <Project projectInfo={value}/>
      case 'registeredPerson':
        return <RegisteredPerson registeredPersonInfo={value}/>
      case 'preregistration':
        return <Preregistration preregistrationInfo={value}/>
      case 'registered':
        return <Registered registeredInfo={value}/>
      default:
        return <></>
    }
  }

  const getPhaseTitle = (key) => {
    switch (key) {
      case 'prereport':
        return 'Preinforme'
      case 'technicalVisit':
        return 'Informe visita tècnica'
      case 'report':
        return 'Report'
      case 'offer':
        return 'Proposta d\'oferta final'
      case 'constructionPermit':
        return 'Permís d\'obra'
      case 'installation':
        return 'Instal·lació'
      case 'deliveryCertificate':
        return 'Acta de recepció'
      case 'legalRegistration':
        return 'Registre Legal'
      case 'legalization':
        return 'Legalització'
      case 'invoice':
        return 'Factura'
      case 'signature':
        return 'Signatura Contracte Clau en mà'
      default:
        return ''
    }
  }

  // TODO: Refactor
  const getPhaseContent = (key, value) => {
    return <PhaseInfo data={value}/>
  }

  const getPhase = (stages, phaseId, withContent = false) => {
    if (stages.length) {
      const { title, content } = stages.find(({ id }) => phaseId === id)
      return <>
        <h3>{title}</h3>
        { withContent && <div> { content } </div> }
      </>
    }
  }

  const handleSendContact = async (data) => {
    try {
      console.log(data)
      setSending(true)
      await sendContact(data)
    } catch (exception) {
      // report error
      console.log(exception)
    }
    setSending(false)
    setOpenContact(false)
  }

  const handleSendIncidence = async (data) => {
    try {
      console.log(data)
      setSending(true)
      await sendIncidence(data)
    } catch (exception) {
      // report error
      console.log(exception)
    }
    setSending(false)
    setOpenIncidence(false)
  }

  return (
    isLoadingCampaign || isLoadingProject
      ? <Loading />
      : <Container maxWidth="lg" className={classes.root}>
        <Grid container>
          {
            !project || project.length === 0
              ? <Grid item xs={12}>
                <div className={clsx(classes.column, classes.noResultsContainer)}>
                  <h3 className={classes.noResults}> { t('NOT_COLLECTIVE_PURCHASES') } </h3>
                </div>
              </Grid>
              : <>
                <Grid item sm={3} xs={12}>
                  <div className={clsx(classes.column, classes.fullHeight)}>
                    {
                      project.map(({ title, content }, index) => (
                        <div key={`${index}-${title}`}>
                          <div
                            key={`${index}-${title}`}
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

                    <div role="button" className={classes.option} onClick={ () => setOpenContact(true) }>
                      <div className={classes.phaseIcon}>
                        <MailOutlinedIcon fontSize="small" />
                      </div>
                      <div className={classes.phaseName}>
                        { t('CONTACT_INSTALL') }
                      </div>
                    </div>

                    <div role="button" className={classes.option} onClick={ () => setOpenIncidence(true) }>
                      <div className={classes.phaseIcon}>
                        <ReportProblemOutlinedIcon fontSize="small" />
                      </div>
                      <div className={classes.phaseName}>
                        { t('NOTIFY_INCIDENCE') }
                      </div>
                    </div>

                    <div className={classes.option}>
                      <div className={classes.phaseIcon}>
                        <PowerSettingsNewOutlinedIcon fontSize="small" />
                      </div>
                      <div className={classes.phaseName}>
                        { t('UNSUBSCRIBE') }
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <div className="">
                    <div className={clsx(classes.column, classes.mainHeader)}>
                      <h2> {campaign.name} </h2>
                      <div className={classes.mainHeaderInfo}>
                        <div> <WbSunnyOutlinedIcon fontSize="small" />
                          &nbsp;{campaign.installations?.completed}
                          &nbsp; { t('INSTALLATIONS') }
                          &nbsp;<RoomOutlinedIcon fontSize="small" />
                          &nbsp;{campaign.region?.geographicalRegion},
                          &nbsp;{campaign.region?.autonomousCommunity}
                        </div>
                        <div> {campaign?.engineering && campaign.engineering.map(
                          ({ name, address, email, phoneNumber }) =>
                            <div key={name} className={classes.engineeringInfo}>
                              &nbsp; <SettingsOutlinedIcon fontSize="small" />
                              &nbsp; <div>
                                <a href={`mailto:${address}`} target="_blank" rel="noopener noreferrer">{name}</a>
                                &nbsp; ({phoneNumber})
                              </div>
                            </div>
                        )}
                          &nbsp;
                        </div>
                      </div>
                    </div>
                    <div className={clsx(classes.column, classes.main)}>
                      <div>
                        {
                          prevPhase &&
                          <div
                            className={classes.phaseTitle}
                            onClick={(event) => setActivePhase(prevPhase)}
                          >
                            { getPhase(stages, prevPhase) }
                            <UndoOutlinedIcon />
                          </div>
                        }

                        <div className={classes.mainPhase}>
                          { getPhase(stages, activePhase, true) }
                        </div>
                      </div>
                      {
                        nextPhase &&
                        <div
                          className={classes.phaseTitle}
                          onClick={(event) => currentPhase === activePhase ? '' : setActivePhase(nextPhase)}
                        >
                          { getPhase(stages, nextPhase) }
                          <RedoOutlinedIcon />
                        </div>
                      }
                    </div>
                  </div>
                </Grid>
                <Grid item sm={3} xs={12}>
                  <div className={classes.column}>
                    {
                      stages && stages.map(({ id, title }) => {
                        const isClickable = !afterCurrent
                        afterCurrent = afterCurrent || currentPhase === id
                        return (
                          <div
                            key={id}
                            className={clsx(classes.phase, afterCurrent && classes.futurePhase, currentPhase === id && classes.currentPhase)}
                            onClick={(event) => isClickable && setActivePhase(id) }
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
              </>
          }
        </Grid>
        <ContactDialog open={openContact} handleClose={ () => setOpenContact(false) } isSending={isSending} handleSend={handleSendContact} />
        <IncidenceDialog open={openIncidence} handleClose={ () => setOpenIncidence(false) } isSending={isSending} handleSend={handleSendIncidence} />
      </Container>
  )
}

export default SomSolet
